import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { StripeCardElement } from "@stripe/stripe-js";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
}

 export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number;
}

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
    const stripe = useStripe();
    const elements = useElements();

    const search = useSearchContext();
    const { hotelId } = useParams();

    const { showToast } = useAppContext();

    const { mutate: bookRoom, isLoading } = useMutation(
        apiClient.createRoomBooking,
        {
          onSuccess: () => {
            showToast({ message: "Đặt phòng thành công!", type: "SUCCESS" });
          },
          onError: () => {
            showToast({ message: "Đặt phòng thất bại", type: "ERROR" });
          },
        }
      );

    const { handleSubmit, register } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childCount: search.childCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
            totalCost: paymentIntent.totalCost,
            paymentIntentId: paymentIntent.paymentIntentId,
        }
    })

    const onSubmit = async (formData: BookingFormData) => {
        if (!stripe || !elements) {
          return;
        }
    
        const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement) as StripeCardElement,
          },
        });
    
        if (result.paymentIntent?.status === "succeeded") {
          bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
        }
      };

    return (
        <form 
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
            <span className="text-3xl font-bold">
                Xác nhận thông tin chi tiết của bạn
            </span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm fond-bold flex-1">
                    First Name
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("firstName")}
                    />
                </label>
                <label className="text-gray-700 text-sm fond-bold flex-1">
                    Last Name
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("lastName")}
                    />
                </label>
                <label className="text-gray-700 text-sm fond-bold flex-1">
                    Email
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("email")}
                    />
                </label>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Giá phòng bạn phải trả</h2>

                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                    Tổng chi phí: {(Math.round(paymentIntent.totalCost * 32395 / 1000) * 1000).toLocaleString('vi-VN')} VNĐ
                    
                    </div>
                    <div className="text-xs">Bao gồm thuế và phí</div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold"> Chi tiết thanh toán</h3>
                <CardElement
                id="payment-element"
                className="border rounded-md p-2 text-sm"
                />
            </div>

            <div className="flex justify-end">
                <button
                disabled={isLoading}
                type="submit"
                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
                >
                {isLoading ? "Đang xác nhận..." : "Xác nhận đặt phòng"}
                </button>
            </div>

        </form>
    )
}

export default BookingForm