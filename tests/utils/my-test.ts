import { test as base } from "@playwright/test";

type TestParmas = {
  params: {
    email: string;
    walletAddress: string;
  };
};

export const test = base.extend<TestParmas>({
  params: {
    email: "jay.hwang@magic.link",
    walletAddress:
      "0xdcacb85efe526adef7d43902ffa3a3f965131a5a02ccb308ad712f460f0310bb",
  },
});
