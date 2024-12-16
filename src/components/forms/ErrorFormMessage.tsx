import { PropsWithChildren } from "react";

export default function ErrorFormMessage({ children }: PropsWithChildren) {
  return <p className=" text-red-500 p-2 mt-2">{children}</p>;
}
