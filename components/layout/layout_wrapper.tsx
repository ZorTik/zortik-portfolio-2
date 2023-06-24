import {Poppins} from "next/font/google";
import styled from "styled-components";
import {PropsWithChildren} from "react";

const interBold = Poppins({ weight: '600', subsets: ['latin'] });
const interLight = Poppins({ weight: '300', subsets: ['latin'] });

const LayoutWrapperStyled = styled("main")`
  .text-2xl, .text-3xl, .text-4xl, .text-5xl, .text-6xl {
      ${interBold.style}
  }
`;

export default function LayoutWrapper(props: PropsWithChildren) {
    return <LayoutWrapperStyled {...props} className={`${interLight.className} min-h-screen w-full`} />
}
