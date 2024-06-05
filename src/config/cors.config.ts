export const prodWhitelist = [
  "https://poc.koenv.dev",
  "https://admin.socket.io",
];
export const devWhitelist = ["http://localhost:3000"];

export const config = {
  origin: function (
    origin: string,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (prodWhitelist.includes(origin) || devWhitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
