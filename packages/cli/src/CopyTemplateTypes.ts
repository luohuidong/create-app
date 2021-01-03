export interface TemplateInfo {
  name: string;
  sha: string;
}
export type TemplatesInfo = {
  [index: string]: TemplateInfo;
};
