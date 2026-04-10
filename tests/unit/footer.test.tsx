import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

describe("Footer", () => {
  it("renders the ICP record with the MIIT link", () => {
    const html = renderToStaticMarkup(
      <Footer
        name="杜旭嘉"
        title="AI 应用工程师（RAG / Agent）"
        availability="远程优先"
        email="2041487752dxj@gmail.com"
        githubUrl="https://github.com/byteD-x"
        websiteLinks={[
          { label: "国内站（自托管）", url: "https://www.byted.online/" },
        ]}
        icpRecord={siteConfig.icpRecord}
        icpRecordUrl={siteConfig.icpRecordUrl}
      />,
    );

    expect(html).toContain("晋ICP备2026004157号-1");
    expect(html).toContain('href="https://beian.miit.gov.cn/"');
    expect(html).toContain("查看备案信息：晋ICP备2026004157号-1");
  });
});
