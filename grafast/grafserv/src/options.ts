import { isAsyncIterable } from "grafast";
import { AsyncExecutionResult, ExecutionResult, GraphQLError } from "graphql";

export function defaultMaskError(error: GraphQLError): GraphQLError {
  if (error.originalError instanceof GraphQLError) {
    return error;
  } else {
    return new GraphQLError(
      "An error occurred",
      error.nodes,
      error.source,
      error.positions,
      error.path,
      error.originalError,
      // Deliberately wipe the extensions
      null,
    );
  }
}

export function makeMaskError(
  callback: (error: GraphQLError) => GraphQLError,
): (error: GraphQLError) => GraphQLError {
  let warnedAboutMaskErrorCallback = false;
  return (error) => {
    const path = error.path;
    const replacement = callback(error);
    if (!warnedAboutMaskErrorCallback && replacement.path !== path) {
      warnedAboutMaskErrorCallback = true;
      console.warn(
        `[WARNING] Your maskError callback is changing the error path; please reuse the path of the original error to ensure compliance with the GraphQL specification. We will not issue this warning again until the server is restarted or another maskError function is provided.`,
      );
    }
    return replacement;
  };
}

export function optionsFromConfig(config: GraphileConfig.ResolvedPreset) {
  const {
    graphqlPath = "/graphql",
    graphqlOverGET = false,
    graphiql = true,
    graphiqlOnGraphQLGET = true,
    graphiqlPath = "/",
    watch = false,
    // TODO: Why 'Path' for graphqlPath and graphiqlPath, but 'Route' for this?!
    eventStreamRoute = "/graphql/stream",
    maxRequestLength = 100_000,
    outputDataAsString = false,
    schemaWaitTime = 15000,
    maskError: rawMaskError,
  } = config.server ?? {};
  const { explain } = config.grafast ?? {};
  const maskError = rawMaskError
    ? makeMaskError(rawMaskError)
    : defaultMaskError;
  const maskPayload = (payload: any) => {
    if (payload.errors) {
      payload.errors = payload.errors.map(maskError);
    }
    return payload;
  };
  const maskIterator = (
    result: AsyncGenerator<AsyncExecutionResult>,
  ): AsyncGenerator<AsyncExecutionResult> => {
    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      return(value) {
        return result.return(value);
      },
      throw(e) {
        return result.throw(e);
      },
      async next(...args: any) {
        const ir = await result.next(...args);
        if (ir.value != null) {
          return {
            done: ir.done,
            value: maskPayload(ir.value),
          };
        } else {
          return ir;
        }
      },
    };
  };
  const maskExecutionResult = (
    result: ExecutionResult | AsyncGenerator<AsyncExecutionResult>,
  ) => {
    if (isAsyncIterable(result)) {
      return maskIterator(result);
    } else {
      return maskPayload(result);
    }
  };
  return {
    outputDataAsString,
    graphqlPath,
    graphqlOverGET,
    graphiql,
    graphiqlOnGraphQLGET,
    graphiqlPath,
    watch,
    eventStreamRoute,
    maxRequestLength,
    explain,
    schemaWaitTime,
    maskError,
    maskPayload,
    maskIterator,
    maskExecutionResult,
  };
}
export type OptionsFromConfig = ReturnType<typeof optionsFromConfig>;
