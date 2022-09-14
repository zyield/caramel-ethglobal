import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Jazzicon from "@metamask/jazzicon";

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  margin-bottom: 0.2rem;
  border-radius: 1.125rem;
`;

function Identicon({ address }) {
  const ref = useRef();

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(address.slice(2, 10), 16)));
    }
  }, [address]);

  return <StyledIdenticon ref={ref} />;
}

export default Identicon
