import React from 'react'; // Needed to satisfy ESLint in older setups or certain configurations
import { RotatingLines } from "react-loader-spinner";

function Loader() {
  return (
    <RotatingLines
      strokeColor="orange"
      strokeWidth="3"
      animationDuration="0.75"
      width="80"
      visible={true}
    />
  )
}

export default Loader;