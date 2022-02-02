import generate from "@babel/generator";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

function isSimpleArg(arg: t.Node): arg is t.Literal | t.Identifier {
  return t.isLiteral(arg) || t.isIdentifier(arg);
}

function isSimpleParam(param: t.Node): param is t.Identifier {
  return t.isIdentifier(param);
}

export const optimize = (ast: t.Node) => {
  traverse(ast, {
    CallExpression: {
      enter(path) {
        const node = path.node;

        if (
          !t.isArrowFunctionExpression(node.callee) &&
          !t.isFunctionExpression(node.callee)
        ) {
          return;
        }

        if (!t.isExpression(node.callee.body)) {
          return;
        }

        const args = node.arguments;
        if (!args.every(isSimpleArg)) {
          return;
        }

        const params = node.callee.params;
        if (!params.every(isSimpleParam)) {
          return;
        }

        if (params.length !== args.length) {
          return;
        }

        // console.log("Found IIFE", generate(node, {}).code);

        const calleePath = path.get("callee");
        const paramsPaths = calleePath.get("params");
        const argumentsPaths = path.get("arguments");
        for (let i = params.length - 1; i >= 0; i--) {
          const param = params[i];
          const arg = args[i];
          const paramPath = paramsPaths[i];
          const argPath = argumentsPaths[i];

          if (t.isIdentifier(arg)) {
            const binding = calleePath.scope.bindings[param.name];

            // TODO: how do we correctly determine if this is safe?
            if (!calleePath.scope[arg.name]) {
              // Rename the references to this arg to match the arg.
              calleePath.scope.rename(param.name, arg.name);

              // Remove the parameters if they match (which they should!).
              const newParam = node.callee.params[i];
              const newArg = node.arguments[i];
              if (
                t.isIdentifier(newParam) &&
                t.isIdentifier(newArg) &&
                newParam.name === newArg.name
              ) {
                // Remove the arg/param, since it's now pointless
                argPath.remove();
                paramPath.remove();
              }
            }
          } else if (t.isLiteral(arg)) {
            const binding = calleePath.scope.bindings[param.name];

            // Replace all references to this identifier with the value
            binding.referencePaths.forEach((referencePath) => {
              referencePath.replaceWith(arg);
            });

            // Remove the arg/param
            argPath.remove();
            paramPath.remove();
          }
        }

        if (node.arguments.length === 0 && node.callee.params.length === 0) {
          // We don't need this IIFE any more
          path.replaceWith(node.callee.body);
        }

        // console.log("REPLACED :", generate(path.node, {}).code);

        return;
      },
    },
    Program: {
      exit(path) {
        // Refresh the scope after all the rewriting
        path.scope.crawl();

        // Replace all things that are only referenced once
        for (const [bindingName, binding] of Object.entries(
          path.scope.bindings,
        )) {
          if (!t.isVariableDeclarator(binding.path.node)) {
            continue;
          }
          if (!t.isIdentifier(binding.path.node.id)) {
            continue;
          }
          if (!binding.path.node.init) {
            continue;
          }

          // Skip if it's an export
          const statementPath = binding.path.getStatementParent();
          if (
            !statementPath ||
            t.isExportNamedDeclaration(statementPath.node) ||
            t.isExportDefaultDeclaration(statementPath.node)
          ) {
            continue;
          }

          // Only replace if it's only referenced once (we don't want duplicates)
          if (binding.referencePaths.length === 1) {
            binding.referencePaths[0].replaceWith(binding.path.node.init);
            binding.path.remove();
          }
        }
      },
    },
  });

  return ast;
};