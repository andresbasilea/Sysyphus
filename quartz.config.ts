import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Sysyphus ⚉",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: false,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          // light: "#FFF4D1", // Softer, warmer light shade
          // lightgray: "#F3E3BF", // Slightly deeper cream for contrast
          // gray: "#B1BCA0", // Gentler green-gray for cohesion
          // darkgray: "#5A5A5A", // A subtle deep gray with a neutral tone
          // dark: "#5B3A2A", // A slightly warmer dark brown
          // secondary: "#1D4052", // A muted teal for depth
          // tertiary: "#799B93", // Softened cool green for balance
          // highlight: "rgba(130, 150, 160, 0.15)", // Adjusted for subtler blending
          // textHighlight: "#FFE94C88", // Softer yellow highlight with better readability
          light: "#faf8f8",
          lightgray: "#D8D3CD",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#2B2A4C",
          tertiary: "#B31312",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
          // light: "#faf8f8",
          // lightgray: "#D8D3CD",
          // gray: "#b8b8b8",
          // darkgray: "#4e4e4e",
          // dark: "#2b2b2b",
          // secondary: "#284b63",
          // tertiary: "#FF2E63",
          // highlight: "#E2DAD6",
          // textHighlight: "#fff23688",
        },
        darkMode: {
          
          // light: "#161618",
          // lightgray: "#393639",
          // gray: "#646464",
          // darkgray: "#d4d4d4",
          // dark: "#ebebec",
          // secondary: "#7b97aa",
          // tertiary: "#84a59d",
          // highlight: "rgba(143, 159, 169, 0.15)",
          // textHighlight: "#b3aa0288",
          light: "#161618",
          lightgray: "#393E46",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#FF2E63",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      // Plugin.CreatedModifiedDate({
      //   priority: ["frontmatter", "filesystem"],
      // }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
