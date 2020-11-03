import Head from "next/head";
import SwaggerUI from "swagger-ui-react";

const Docs = () => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.36.0/swagger-ui.css"
          integrity="sha512-tKlTmmIcJ/LXt94SNEbo3ZXMHhaa9quOeqk+sfMKYvTadSD2xSzmN95EOeITw7rmAQOuHStvbqA1W7fCU6RQZQ=="
          crossOrigin="anonymous"
        />
      </Head>
      <SwaggerUI url="/swagger.json" />
    </>
  );
};

export default Docs;
