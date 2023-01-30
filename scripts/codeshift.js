// jscodeshift can take a parser, like "babel", "babylon", "flow", "ts", or "tsx"
// Read more: https://github.com/facebook/jscodeshift#parser
export const parser = 'tsx';

// Press ctrl+space for code completion
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

  // utility to remove all constructs('../') from the import statments
  const getImportWithoutConstructs = (nodeValue) => {
    let value = nodeValue;
    while (value.includes('../')) {
      value = value.replace('../', '');
    }

    return value;
  };

  const normalImports = source
    .find(j.ImportDeclaration) // Find all nodes that match a type of `ImportDeclaration`
    .filter((path) => {
      const nodeValue = getImportWithoutConstructs(path.node.source.value);

      return importAliasArray.includes(nodeValue.split('/')[0]);
    }); // Filter imports by source equal to the target

  normalImports.forEach(
    (
      normalImport, // Iterate over react imports
    ) =>
      // Replace the existing node with a new one

      j(normalImport).replaceWith(
        // Build a new import declaration node based on the existing one
        j.importDeclaration(
          normalImport.node.specifiers, // copy over the existing import specificers
          j.stringLiteral(
            getImportWithoutConstructs(normalImport.node.source.value),
          ), // Replace the source with our new source
        ),
      ),
  );

  return source.toSource({ quote: 'single' });
}
