import { errorResult, okResult } from "@pormeldev/axis-common-lib";
import { toUiError } from "@/common/errors/ui-error";
import { getUiErrorCode, getUiErrorMessage, getUiErrors } from "./result";

describe("result utils", () => {
  it("returns null for successful results", () => {
    expect(getUiErrorCode(okResult<string, never>("ok"))).toBeNull();
  });

  it("returns the first mapped UI error code for failed results", () => {
    expect(
      getUiErrorCode(errorResult<null, ReturnType<typeof toUiError>>([toUiError("UNKNOWN_ERROR")])),
    ).toBe("UNKNOWN_ERROR");
  });

  it("returns the first UI error message", () => {
    const result = errorResult<null, ReturnType<typeof toUiError>>([toUiError("UNKNOWN_ERROR")]);

    expect(getUiErrorMessage(result)).toBe(toUiError("UNKNOWN_ERROR").uiMessage);
  });

  it("returns UI errors for failed results", () => {
    const result = errorResult<null, ReturnType<typeof toUiError>>([
      toUiError("UNKNOWN_ERROR"),
      toUiError("NETWORK_ERROR"),
    ]);

    expect(getUiErrors(result)).toEqual([toUiError("UNKNOWN_ERROR"), toUiError("NETWORK_ERROR")]);
  });
});
