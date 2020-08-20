import React from "react";
import styled, { keyframes } from "styled-components";

const BounceAnimation = keyframes`
  0% { margin-bottom: 0; opacity:1; }
  50% { margin-bottom: 15px; opacity: 1; }
  75% {margin-bottom: -2px; height: 12px;}
  100% { margin-bottom: 0; opacity:0.5; height 15px;}
`;

const Dot = styled.div`
  background-color: ${(props) => props.theme.primary};
  border-radius: 50%;
  width: 15px;
  height: 15px;
  margin: 0 5px;
  /* Animation */
  animation-name: ${BounceAnimation};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-delay: ${(props) => props.delay};
  display: inline-block;
  opacity: 0.5;
`;

const LoadingDots = () => {
  return (
    <div>
      <Dot delay="0s" />
      <Dot delay=".2s" />
      <Dot delay=".4s" />
    </div>
  );
};

export default LoadingDots;
