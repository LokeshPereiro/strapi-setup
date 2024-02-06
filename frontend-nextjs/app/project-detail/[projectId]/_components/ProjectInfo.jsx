import { AlertOctagon, BadgeCheck, ShoppingCart } from "lucide-react";
import React, { useContext } from "react";
import SkeltonProjectInfo from "./SkeltonProjectInfo";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CartContext } from "./../../../_context/CartContext";
import GlobalApi from "./../../../_utils/GlobalApi";

function ProjectInfo({ product }) {
  // console.log(product);
  const { user } = useUser();
  const router = useRouter();
  const { cart, setCart } = useContext(CartContext);

  //Use to Add Project/Product into Cart
  const onAddToCartClick = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    } else {
      //Logic to Add to Cart
      const data = {
        data: {
          userName: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          product: product?.id,
        },
      };
      GlobalApi.addToCart(data).then(
        (resp) => {
          // console.log("Add to Cart", resp);
          if (resp) {
            setCart((cart) => [
              ...cart,
              {
                id: resp?.data?.id,
                product: product,
              },
            ]);
          }
        },
        (error) => {
          console.log("Error", error);
        }
      );
    }
  };
  return (
    <div>
      {product ? (
        <div>
          <h2 className="text-[20px]">{product?.attributes?.title}</h2>
          <h2 className="text-[15px] text-gray-400">
            {product?.attributes?.category}
          </h2>
          <h2 className="text-[15px] mt-5 text-gray-700">
            {/* {product?.attributes?.description} */}
          </h2>

          <h2
            className="flex gap-2 mt-5 
        text-gray-500 text-[13px]"
          >
            {product?.attributes.instantDelivery ? (
              <BadgeCheck className="text-green-500 h-5 w-5" />
            ) : (
              <AlertOctagon
                className="
            text-yellow-400 h-5 w-5"
              />
            )}
            Eligible for Instant Delivery
          </h2>
          <h2
            className="text-[32px] 
        text-primary font-medium
        mt-5"
          >
            $ {product?.attributes?.pricing}
          </h2>
          <button
            className="flex gap-2 p-3 
        px-10 mt-5
        bg-primary
        hover:bg-blue-700
         text-white rounded-lg"
            onClick={() => onAddToCartClick()}
          >
            <ShoppingCart />
            Add to Cart
          </button>
        </div>
      ) : (
        <SkeltonProjectInfo />
      )}
    </div>
  );
}

export default ProjectInfo;
