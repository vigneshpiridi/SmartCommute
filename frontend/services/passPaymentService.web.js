// Web variant of passPaymentService.js (Metro picks *.web.js for web builds).
// The native-only `react-native-razorpay` module is not imported here, so
// only demo payments work on web. Everything downstream of the payment
// (verify, pass activation, navigate to PassEntry) is identical to the
// native file.
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Demo mode: ask the user to confirm a fake payment. No real money moves.
function confirmDemoPayment(amountPaise) {
  return new Promise((resolve) => {
    Alert.alert(
      "Demo payment — no real money",
      `This is a demo payment. No real money will be taken.\nAmount: ₹${(amountPaise / 100).toFixed(2)}`,
      [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "Pay (Demo)", onPress: () => resolve(true) },
      ]
    );
  });
}

export async function payForPass({ intentId, token, navigation }) {
  try {
    if (!intentId) {
      throw new Error("Invalid payment intent");
    }

    // 1️⃣ Create Razorpay order (PASS)
    const res = await fetch(`${API_URL}/pass/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Tunnel-Skip-AntiPhishing-Page": "true"
      },
      body: JSON.stringify({ intentId })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create order");

    // 2️⃣ Web has no native Razorpay checkout — demo payments only
    if (process.env.EXPO_PUBLIC_DEMO_MODE !== "true") {
      throw new Error("Razorpay checkout is not available on web. Please use demo mode.");
    }

    const confirmed = await confirmDemoPayment(data.amount);
    if (!confirmed) return; // user cancelled the demo payment

    // Simulate a short processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const paymentData = {
      razorpay_order_id: data.orderId,
      razorpay_payment_id: `pay_demo_${Math.random().toString(36).slice(2, 10)}`,
      razorpay_signature: "demo",
    };

    // 3️⃣ Verify payment (PASS)
    const verifyRes = await fetch(`${API_URL}/pass/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Tunnel-Skip-AntiPhishing-Page": "true"
      },
      body: JSON.stringify(paymentData)
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) {
      throw new Error(verifyData.error || "Payment verification failed");
    }

    Alert.alert("Success", "Pass activated successfully");

    // 4️⃣ IMPORTANT: Go back to resolver
    navigation.replace("PassEntry");

  } catch (err) {
    // Check if user cancelled the payment
    if (err.code === 0) {
      console.log("Pass payment cancelled by user");
      Alert.alert("Payment Cancelled", "You cancelled the payment. You can try again.");
      return;
    }
    console.error("Pass payment error:", err);
    Alert.alert(
      "Payment Failed",
      err.message || "Please try again"
    );
  }
}
