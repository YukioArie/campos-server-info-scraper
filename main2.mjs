import puppeteer from "puppeteer";
import XLSX from "xlsx";

async function initialize() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "http://riodejaneiro1.dcfiorilli.com.br:8079/Transparencia/servidores.aspx"
  );
  await page.setViewport({ width: 1920, height: 1080 });
  await page.click('input[name="cmbMes"]');
  await page.hover(".dxeListBoxItemRow_DevEx:nth-child(3)");
  await page.hover(".dxeListBoxItemRow_DevEx:nth-child(3)");

  // Espera explícita após passar o mouse
  await page.waitForSelector(".dxeListBoxItemRow_DevEx:nth-child(3)");
  await page.click(".dxeListBoxItemRow_DevEx:nth-child(3)");

  await page.waitForSelector(".dxeListBoxItemRow_DevEx:nth-child(3)");

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }), // Espera a navegação completar
    page.click('input[name="btnPesquisar"]'), // Clica no botão de pesquisa
  ]);
  // await page.click('input[name="btnPesquisar"]');
  // await page.waitForNavigation;
  // await page.click('input[name="cmbMes"]');
  // await Promise.all([
  //   page.waitForNavigation({ waitUntil: "networkidle0" }), // Espera a navegação completar
  //   page.click("tbody #gridPessoal_DXDataRow0 #gridPessoal_tccell0_38 img"),
  // ]);
  await page.click("tbody #gridPessoal_DXDataRow0 #gridPessoal_tccell0_38 img");
  await page.waitForSelector("#pcDetalhe_callbackPanel_ASPxPanel1_lblServidor");

  const name = await page.evaluate(() => {
    const el = document.querySelector(
      "#pcDetalhe_callbackPanel_ASPxPanel1_lblServidor"
    );
    return el.innerHTML;
  });

  // const name = await page.$eval(
  //   "#pcDetalhe_callbackPanel_ASPxPanel1_lblServidor"
  // );
  console.log(name);
}
initialize();
