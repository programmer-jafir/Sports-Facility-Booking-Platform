// import axios from 'axios';
// import config from '../../config/index';

// export const initiatePayment = async(paymentData: any) =>{
//     const response = await axios.post(config.payment_url!,{
//     store_id: config.store_id,
//     signature_key: config.signature_key,
//     tran_id: paymentData.transactionId,
//     success_url: "http://www.merchantdomain.com/suc esspage.html",
//     fail_url: "http://www.merchantdomain.com/faile dpage.html",
//     cancel_url: "http://www.merchantdomain.com/can cellpage.html",
//     amount: paymentData.payableAmount,
//     currency: "BDT",
//     desc: "Merchant Registration Payment",
//     cus_name: paymentData.customerName,
//     cus_email: paymentData.customerEmail,
//     cus_add1: paymentData.customerAddress,
//     cus_phone: paymentData.customerPhone,
//     cus_add2: "N/A",
//     cus_cit: "N/A",
//     cus_state: "N/A",
//     cus_postcode: "N/A",
//     cus_country: "N/A",
//     type: "json"
//     });
//     console.log(response)
//     return response.data
// }





import axios from "axios";

const AMAR_PAY_STORE_ID = "your_store_id";
const AMAR_PAY_SIGNATURE_KEY = "your_signature_key";
const AMAR_PAY_BASE_URL = "https://sandbox.amarpay.com"; // Change for production

export const initiatePayment = async (booking: any) => {
  try {
    const paymentData = {
      store_id: AMAR_PAY_STORE_ID,
      amount: booking.payableAmount,
      currency: "BDT",
      tran_id: `TXN-${Date.now()}`,
      success_url: "http://www.merchantdomain.com/suc esspage.html",
    fail_url: "http://www.merchantdomain.com/faile dpage.html",
    cancel_url: "http://www.merchantdomain.com/can cellpage.html",
      signature_key: AMAR_PAY_SIGNATURE_KEY,
      cus_name: booking.user.name,
      cus_email: booking.user.email,
      cus_phone: booking.user.phone,
      cus_add1: booking.user.address,
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
    };

    const response = await axios.post(`${AMAR_PAY_BASE_URL}/api/v1/pay`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw new Error("Payment initiation failed");
  }
};
