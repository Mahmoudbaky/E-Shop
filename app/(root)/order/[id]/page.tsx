import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Order, ShippingAddress } from "@/types";
import { auth } from "@/auth";
import OrderDetailsTable from "./order-details-table";
import Stripe from "stripe";

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const order = await getOrderById(id);

  const session = await auth();

  let client_secret = null;

  if (order.paymentMethod === "stripe" && !order.isPaid) {
    // Init stripe instace
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: {
        order_id: order.id,
      },
    });

    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "admin" || false}
    />
  );
};

export default OrderDetailsPage;
