/**
 * Transformation module — replaces ACE ESQL Compute Node.
 *
 * Move your ESQL business logic here. Each ESQL compute module
 * becomes a JavaScript function.
 *
 * ACE ESQL equivalent:
 *   CREATE COMPUTE MODULE MyFlow_Compute
 *     CREATE FUNCTION Main() RETURNS BOOLEAN
 *       SET OutputRoot.JSON.Data.result = ...transform(InputRoot.JSON.Data)...
 *       RETURN TRUE;
 *     END;
 *   END MODULE;
 */

/**
 * @param {object} input - The incoming message (was InputRoot.JSON.Data in ESQL)
 * @returns {object} - The output message (was OutputRoot.JSON.Data in ESQL)
 */
function transform(input) {
  // Example: replaces ESQL field mapping
  // SET OutputRoot.JSON.Data.fullName = InputRoot.JSON.Data.firstName || ' ' || InputRoot.JSON.Data.lastName;
  const fullName = `${input.firstName || ''} ${input.lastName || ''}`.trim();

  // Example: replaces ESQL conditional routing
  // IF InputRoot.JSON.Data.type = 'ORDER' THEN ...
  const type = input.type || 'UNKNOWN';

  return {
    fullName,
    processedType: type,
    status: 'PROCESSED',
  };
}

module.exports = { transform };
