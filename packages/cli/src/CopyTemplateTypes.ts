export interface TemplateInfo {
  name: string;
  sha: string;
}
export type TemplatesInfo = {
  [index: string]: TemplateInfo;
};

export interface RepoTreeItemInfo {
  path: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

export type RepoTreeInfo = RepoTreeItemInfo[];
