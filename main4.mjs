import puppeteer from "puppeteer";
import XLSX from "xlsx";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initialize() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "http://riodejaneiro1.dcfiorilli.com.br:8079/Transparencia/Default.aspx?AcessoIndividual=LnkServidores"
  );
  await page.setViewport({ width: 1920, height: 1080 });
  await sleep(3000);
  const frameHandle = await page.$("iframe");
  const frame = await frameHandle.contentFrame();
  await page.hover("#cmbEntidadeContabil_B-1");
  await sleep(3000);
  await page.click("#cmbEntidadeContabil_B-1");
  await sleep(3000);
  const elements = await page.$$(
    "#cmbEntidadeContabil_DDD_L_D > table > tbody > tr > td "
  );
  let i = 0;
  for (const element of elements) {
    if (i > 0) {
      if (i === 1) {
        await sleep(3000);
        const id = await element.evaluate((el) => el.id);
        await page.hover("#" + id);
        await sleep(3000);
        await page.click("#" + id);
        await sleep(3000);
        const mes = await page.$$("#divPaginaConteudoHome");
        //////////////////////////////////////////////// clica no filtro do mes
        await frame.click('input[name="cmbMes"]');
        await sleep(3000);
        await frame.hover(".dxeListBoxItemRow_DevEx:nth-child(3)");
        await sleep(3000);
        await frame.click(".dxeListBoxItemRow_DevEx:nth-child(3)");
        await sleep(2000);
        await frame.click('input[name="btnPesquisar"]');
        await sleep(5000);
        //////////////////////////////////////////////
        /////// pega quantidade de paginas
        const pageQuantity = await frame.evaluate(() => {
          const footerText = document.querySelector(
            ".CSS_TextoRodape_ASPx"
          ).innerHTML;
          const pageQuantity = Number(
            footerText.match(/Total de páginas - \d+/)[0].split("-")[1]
          );
          return pageQuantity;
        });
        ////////
        /////// navega entre as tabelas
        if (pageQuantity === 0) {
          const peopleTable = await frame.$$(
            "#gridPessoal_DXMainTable tbody .CorLinha"
          );
          ////////////////////////// pega as informaçoes
          for (const peopleTableRow of peopleTable) {
            const id = await peopleTableRow.evaluate(
              (el) => el.querySelector("td:nth-child(1)").id
            );
            await frame.click("#" + id + " img");
            await sleep(5000);
            await frame.click(
              "#pcDetalhe_callbackPanel_ASPxPanel1_imgButtonFechar"
            );
            await sleep(5000);
          }
        } else {
          for (let x = 0; x < pageQuantity; x++) {
            const peopleTable = await frame.$$(
              "#gridPessoal_DXMainTable tbody .CorLinha"
            );
            ////////////////////////// pega as informaçoes
            for (const peopleTableRow of peopleTable) {
              console.log("Linha");
              const id = await peopleTableRow.evaluate(
                (el) => el.querySelector("td:nth-child(1)").id
              );
              console.log(id);
              await frame.click("#" + id + " img");
              await sleep(5000);
              await frame.click(
                "#pcDetalhe_callbackPanel_ASPxPanel1_imgButtonFechar"
              );
              await sleep(5000);
            }
            const btnNext =
              "#gridPessoal_DXPagerBottom tbody tr td table tbody tr img[alt='Next']";
            //////// aperta no botao de navegacao
            try {
              await frame.hover(btnNext);
              sleep(3000);
              await frame.click(btnNext);
              await frame.waitForNavigation({ timeout: 1000 });
              //   sleep(3000);
            } catch (e) {
              console.log(e);
              continue;
            }

            /////////////////////////
          }
        }
      } else {
        await sleep(3000);
        await page.hover("#cmbEntidadeContabil_B-1");
        await sleep(3000);
        await page.click("#cmbEntidadeContabil_B-1");
        await sleep(3000);
        const id = await element.evaluate((el) => el.id);
        await page.hover("#" + id);
        await sleep(3000);
        await page.click("#" + id);
        await sleep(3000);
        //////////////////////////////////////////////
        await frame.click('input[name="cmbMes"]');
        await sleep(3000);
        await frame.hover(".dxeListBoxItemRow_DevEx:nth-child(3)");
        await sleep(3000);
        await frame.click(".dxeListBoxItemRow_DevEx:nth-child(3)");
        await sleep(2000);
        await frame.click('input[name="btnPesquisar"]');
        await sleep(5000);
        /////// pega quantidade de paginas
        const pageQuantity = await frame.evaluate(() => {
          const footerText = document.querySelector(
            ".CSS_TextoRodape_ASPx"
          ).innerHTML;
          const pageQuantity = Number(
            footerText.match(/Total de páginas - \d+/)[0].split("-")[1]
          );
          return pageQuantity;
        });
        ////////
        /////// navega entre as tabelas
        if (pageQuantity === 0) {
          const peopleTable = await frame.$$(
            "#gridPessoal_DXMainTable tbody .CorLinha"
          );
          ////////////////////////// pega as informaçoes
          for (const peopleTableRow of peopleTable) {
            const id = await peopleTableRow.evaluate(
              (el) => el.querySelector("td:nth-child(1)").id
            );
            await frame.click("#" + id + " img");
            await sleep(5000);
            await frame.click(
              "#pcDetalhe_callbackPanel_ASPxPanel1_imgButtonFechar"
            );
            await sleep(5000);
          }
        } else {
          for (let x = 0; x < pageQuantity; x++) {
            const peopleTable = await frame.$$(
              "#gridPessoal_DXMainTable tbody .CorLinha"
            );
            ////////////////////////// pega as informaçoes
            for (const peopleTableRow of peopleTable) {
              const id = await peopleTableRow.evaluate(
                (el) => el.querySelector("td:nth-child(1)").id
              );
              await frame.click("#" + id + " img");
              await sleep(5000);
              await frame.click(
                "#pcDetalhe_callbackPanel_ASPxPanel1_imgButtonFechar"
              );
              await sleep(5000);
            }
            //// add id para btn de navegação entre as tabelas
            const btnNext =
              "#gridPessoal_DXPagerBottom tbody tr td table tbody tr img[alt='Next']";
            //////// aperta no botao de navegacao
            try {
              await frame.hover(btnNext);
              sleep(3000);
              await frame.click(btnNext);
              await frame.waitForNavigation({ timeout: 1000 });
            } catch (e) {
              console.log(e);
              continue;
            }
            sleep(3000);
            ///////////
            /////////////////////////
          }
        }
      }
    }

    // const currentEntity = await element.evaluate((el) => el.textContent.trim());
    // if (nameEntity !== currentEntity) {
    //   nameEntity = currentEntity;
    //   console.log(nameEntity);
    // }
    // const text = await element.evaluate((el) => el.textContent.trim());
    // console.log(text); // Imprime o texto de cada elemento

    // const tdElement = await element.$("td");
    // const id = await tdElement.evaluate((el) => el.id);
    // console.log(id);

    i++;
  }
}
initialize();
