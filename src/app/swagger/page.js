"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
});

export default function SwaggerPage() {
  if (process.env.NODE_ENV !== "development") {
    return <p>Swagger is disabled in production</p>;
  }

  return <SwaggerUI url="/api/swagger" />;
}
