require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartcommute";
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const ticketRoutes = require("./routes/ticket.routes");
const adminRoutes = require("./routes/admin.routes");
const busRoutes = require("./routes/bus.routes");
const conductorRoutes = require("./routes/conductor.routes");
const authRoutes = require("./routes/auth.routes");
const paymentRoutes = require("./routes/payment.routes");
const passRoutes = require("./routes/pass.routes");
const passPaymentRoutes = require("./routes/pass.payment.routes");
const passengerRoutes = require("./routes/passenger.routes");
const feedbackRoutes = require("./routes/feedback.routes");

// Health check (used by hosting platforms)
app.get("/", (req, res) => {
  res.json({ ok: true, service: "SmartCommute API" });
});

app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use("/admin", adminRoutes);
app.use("/bus", busRoutes);
app.use("/conductor", conductorRoutes);
app.use("/pass", passRoutes);
app.use("/payment", paymentRoutes);
app.use("/pass/payment", passPaymentRoutes);
app.use("/passenger", passengerRoutes);
app.use("/feedback", feedbackRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
