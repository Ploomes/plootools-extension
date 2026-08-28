/**
 * Context passed to a template file's `content` generator function.
 * `selected` holds the keys of the sibling files the user actually chose to
 * create, so a generator can skip imports/exports of files that won't exist.
 */
interface ITemplateContentContext {
  selected: Set<string>;
}

export default ITemplateContentContext;
