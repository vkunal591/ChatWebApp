declare module "tokml" {
  const tokml: (geojson: any) => string;
  export default tokml;
}

// const tokml = (await import("tokml")).default;
