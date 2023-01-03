// jscodeshift can take a parser, like "babel", "babylon", "flow", "ts", or "tsx"
// Read more: https://github.com/facebook/jscodeshift#parser
export const parser = 'tsx';

export default function transformer(file, api) {
  const j = api.jscodeshift;

  const source = j(file.source);

  const importAliasArray = [
    'components',
    'context',
    'hooks',
    'images',
    'models',
    'context',
    'mapContext',
  ];

  const normalImports = source
    .find(j.ImportDeclaration) // Find all nodes that match a type of `ImportDeclaration`
    .filter((path) =>
      importAliasArray.includes(path.node.source.value.split('/')[2]),
    );

  normalImports.forEach((normalImport) =>
    // Replace the existing node with a new one

    j(normalImport).replaceWith(
      // Build a new import declaration node based on the existing one
      j.importDeclaration(
        normalImport.node.specifiers,
        j.stringLiteral(normalImport.node.source.value.slice(6)),
      ),
    ),
  );

  return source.toSource({ quote: 'single' });
}
