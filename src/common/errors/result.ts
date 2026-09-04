import {
  errorPagedResult,
  errorResult,
  type PagedResult,
  type Result,
} from "@pormeldev/axis-common-lib";
import {
  createResultHelpers,
  getErrorCode,
  getErrorMessage,
  getErrors,
} from "@pormeldev/axis-shared";
import { toUiError, type UiError } from "@/common/errors/ui-error";

type ResultLike<T> = Result<T, UiError> | PagedResult<T, UiError>;

export function getUiErrors<T>(result: ResultLike<T>): UiError[] {
  return getErrors(result);
}

export function getUiErrorCode<T>(result: ResultLike<T>): string | null {
  return getErrorCode(result);
}

export function getUiErrorMessage<T>(result: ResultLike<T>): string | null {
  return getErrorMessage(result);
}

const resultHelpers = createResultHelpers<
  UiError,
  Result<unknown, UiError>,
  PagedResult<unknown, UiError>
>({
  createError: toUiError,
  createErrorResult: (errors) => errorResult<unknown, UiError>(errors),
  createPagedErrorResult: (errors) => errorPagedResult<unknown, UiError>(errors),
});

export function toErrorResult<T>(code: string, locale?: string): Result<T, UiError> {
  return resultHelpers.toErrorResult(code, locale) as Result<T, UiError>;
}

export function toPagedErrorResult<T>(code: string, locale?: string): PagedResult<T, UiError> {
  return resultHelpers.toPagedErrorResult(code, locale) as PagedResult<T, UiError>;
}
