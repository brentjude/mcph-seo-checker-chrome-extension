/** Raw facts extracted from the active tab's DOM. No scoring/opinion lives here. */
export interface PageAuditData {
  url: string;
  domain: string;
  favicon: string | null;

  meta: {
    title: string | null;
    titleLength: number;
    description: string | null;
    descriptionLength: number;
    canonical: string | null;
    robots: string | null;
    viewport: string | null;
    charset: string | null;
    lang: string | null;
  };

  headings: {
    h1: string[];
    h2Count: number;
    h3Count: number;
    h4PlusCount: number;
    hierarchyIssues: boolean;
  };

  images: {
    total: number;
    missingAlt: number;
    missingAltSrcs: string[];
    withLazyLoading: number;
  };

  links: {
    internalCount: number;
    externalCount: number;
    nofollowCount: number;
    brokenAnchorCount: number;
  };

  schema: {
    jsonLdBlocks: Array<{ type: string | string[] | null; raw: string }>;
    hasOrganization: boolean;
    hasFaqPage: boolean;
    hasArticleOrBlogPosting: boolean;
    hasBreadcrumb: boolean;
  };

  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;

  content: {
    wordCount: number;
    textSample: string;
    hasFaqPattern: boolean;
    listCount: number;
    tableCount: number;
    paragraphCount: number;
    avgParagraphLength: number;
    hasAuthorSignal: boolean;
    hasDateSignal: boolean;
    hasDefinitionPattern: boolean;
    hasContactInfo: boolean;
    entityDensityHint: number;
  };
}
