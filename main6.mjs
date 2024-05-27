import puppeteer from "puppeteer";
import xlsx from "xlsx";
import fs from "fs";

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
  await sleep(2000);
  const frameHandle = await page.$("iframe");
  const frame = await frameHandle.contentFrame();
  await frame.click('input[name="cmbMes"]');
  await sleep(2000);
  await frame.hover(".dxeListBoxItemRow_DevEx:nth-child(3)");
  await sleep(2000);
  await frame.click(".dxeListBoxItemRow_DevEx:nth-child(3)");
  await sleep(2000);
  await frame.click('input[name="btnPesquisar"]');
  await sleep(20000);
  const entity = await page.$eval("input[name='cmbEntidadeContabil']", (e) =>
    e.value.trim()
  );
  const listPeople = [];
  const listError = [];
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
  for (let x = 0; x < pageQuantity; x++) {
    const peopleTable = await frame.$$(
      "#gridPessoal_DXMainTable tbody .CorLinha"
    );
    ////////////////////////// pega as informaçoes

    for (const peopleTableRow of peopleTable) {
      try {
        const id = await peopleTableRow.evaluate(
          (el) => el.querySelector("td:nth-child(1)").id
        );
        const earnings = await peopleTableRow.evaluate((el) => {
          const info = el.querySelector("td:nth-child(3)").innerText.trim();
          if (!info) return null;
          return info;
        });
        const netEarnings = await peopleTableRow.evaluate((el) => {
          const info = el.querySelector("td:nth-child(4)").innerText.trim();
          if (!info) return null;
          return info;
        });
        await frame.click("#" + id + " img");
        await sleep(3000);
        ////////////////////////////// guarda as informaçoes
        const obj = {};
        const name = await frame.$eval(
          "#pcDetalhe_callbackPanel_ASPxPanel1_lblServidor",
          (el) => el.innerHTML
        );
        const workplace = await frame.$eval(
          "#pcDetalhe_callbackPanel_ASPxPanel1_lblDadosServidorLinha2",
          (el) => el.innerText.split(" Local de Trabalho: ")[1].trim()
        );
        const jobRole = await frame.$eval(
          "#pcDetalhe_callbackPanel_ASPxPanel1_lblDadosServidorLinha2",
          (el) =>
            el.innerText
              .split(" Local de Trabalho: ")[0]
              .replace("Cargo:", "")
              .trim()
        );
        const reference = await frame.$eval(
          "#pcDetalhe_callbackPanel_ASPxPanel1_lblDadosServidorLinha1",
          (el) => el.innerText.replace("Referência: ", "").trim()
        );

        obj["Nome"] = name;
        obj["Cargo"] = jobRole;
        obj["Local de trabalho"] = workplace;
        obj["Referência"] = reference;
        obj["Fundação"] = entity;
        obj["Proventos"] = earnings;
        obj["Líquido"] = netEarnings;
        listPeople.push(obj);

        const userInfoTable = await frame.$$(
          "#pcDetalhe_callbackPanel_ASPxPanel1_grdDetalhesProventosDescontos_DXMainTable tr"
        );

        for (const userInfoRow of userInfoTable) {
          const infoName = await userInfoRow.$eval(
            "td:nth-child(1)",
            (el) => el.innerText
          );
          let infoReference;
          try {
            infoReference = await userInfoRow.evaluate((el) => {
              const info = el.querySelector("td:nth-child(2)").innerText.trim();
              if (!info) return null;
              return info;
            });
          } catch (error) {
            continue;
          }

          const infoEarnings = await userInfoRow.evaluate((el) => {
            const info = el.querySelector("td:nth-child(3)").innerText.trim();
            if (!info) return null;
            return info;
          });

          const infoDiscounts = await userInfoRow.evaluate((el) => {
            const info = el.querySelector("td:nth-child(4)").innerText.trim();
            if (!info) return null;
            return info;
          });

          obj[infoName + " | REFERÊNCIA"] = infoReference;
          obj[infoName + " | PROVENTOS"] = infoEarnings;
          obj[infoName + " | DESCONTOS"] = infoDiscounts;
        }
        console.log(listPeople);
        //////////////////////////////
        await frame.click(
          "#pcDetalhe_callbackPanel_ASPxPanel1_imgButtonFechar"
        );
        await sleep(3000);
      } catch (error) {
        try {
          const id = await peopleTableRow.evaluate(
            (el) => el.querySelector("td:nth-child(1)").id
          );
          const earnings = await peopleTableRow.evaluate((el) => {
            const info = el.querySelector("td:nth-child(3)").innerText.trim();
            if (!info) return null;
            return info;
          });
          const netEarnings = await peopleTableRow.evaluate((el) => {
            const info = el.querySelector("td:nth-child(4)").innerText.trim();
            if (!info) return null;
            return info;
          });
          await frame.click("#" + id + " img");
          await sleep(3000);
          ////////////////////////////// guarda as informaçoes
          const obj = {};
          const name = await frame.$eval(
            "#pcDetalhe_callbackPanel_ASPxPanel1_lblServidor",
            (el) => el.innerHTML
          );
          const workplace = await frame.$eval(
            "#pcDetalhe_callbackPanel_ASPxPanel1_lblDadosServidorLinha2",
            (el) => el.innerText.split(" Local de Trabalho: ")[1].trim()
          );
          const jobRole = await frame.$eval(
            "#pcDetalhe_callbackPanel_ASPxPanel1_lblDadosServidorLinha2",
            (el) =>
              el.innerText
                .split(" Local de Trabalho: ")[0]
                .replace("Cargo:", "")
                .trim()
          );
          const reference = await frame.$eval(
            "#pcDetalhe_callbackPanel_ASPxPanel1_lblDadosServidorLinha1",
            (el) => el.innerText.replace("Referência: ", "").trim()
          );

          obj["Nome"] = name;
          obj["Cargo"] = jobRole;
          obj["Local de trabalho"] = workplace;
          obj["Referência"] = reference;
          obj["Fundação"] = entity;
          obj["Proventos"] = earnings;
          obj["Líquido"] = netEarnings;
          listPeople.push(obj);

          const userInfoTable = await frame.$$(
            "#pcDetalhe_callbackPanel_ASPxPanel1_grdDetalhesProventosDescontos_DXMainTable tr"
          );

          for (const userInfoRow of userInfoTable) {
            const infoName = await userInfoRow.$eval(
              "td:nth-child(1)",
              (el) => el.innerText
            );
            let infoReference;
            try {
              infoReference = await userInfoRow.evaluate((el) => {
                const info = el
                  .querySelector("td:nth-child(2)")
                  .innerText.trim();
                if (!info) return null;
                return info;
              });
            } catch (error) {
              continue;
            }

            const infoEarnings = await userInfoRow.evaluate((el) => {
              const info = el.querySelector("td:nth-child(3)").innerText.trim();
              if (!info) return null;
              return info;
            });

            const infoDiscounts = await userInfoRow.evaluate((el) => {
              const info = el.querySelector("td:nth-child(4)").innerText.trim();
              if (!info) return null;
              return info;
            });

            obj[infoName + " | REFERÊNCIA"] = infoReference;
            obj[infoName + " | PROVENTOS"] = infoEarnings;
            obj[infoName + " | DESCONTOS"] = infoDiscounts;
          }
          console.log(listPeople);
          //////////////////////////////
          await frame.click(
            "#pcDetalhe_callbackPanel_ASPxPanel1_imgButtonFechar"
          );
          await sleep(3000);
        } catch (error) {
          const message = {};
          message["erro"] = "Deu erro";
          listError.push(message);
          continue;
        }
      }
    }

    //// add id para btn de navegação entre as tabelas
    const btnNext =
      "#gridPessoal_DXPagerBottom tbody tr td table tbody tr img[alt='Next']";
    //////// aperta no botao de navegacao
    try {
      await frame.hover(btnNext);
      sleep(2000);
      await frame.click(btnNext);
      await frame.waitForNavigation({ timeout: 1000 });
    } catch (e) {
      console.log(e);
      continue;
    }
    sleep(2000);
    ///////////

    /////////////////////////
  }
  //////// extrai em json
  const jsonString = JSON.stringify(listPeople, null, 2);
  const caminhoArquivo = "lista_servidores_municipio_campos.json";
  const jsonError = JSON.stringify(listError, null, 2);

  fs.writeFile(caminhoArquivo, jsonString, (err) => {
    if (err) {
      console.error("Erro ao escrever o arquivo JSON:", err);
      return;
    }
    console.log("Arquivo JSON salvo com sucesso:", caminhoArquivo);
  });
  ///////////////////////////////////////////////////////////
  try {
    fs.writeFile("error_list.json", jsonError, (err) => {
      if (err) {
        console.error("Erro ao escrever o arquivo JSON:", err);
        return;
      }
      console.log("Arquivo JSON salvo com sucesso:", "error_list.json");
    });
  } catch (error) {
    console.error(error);
  }

  /////////////////
  ///////////////// extrai em xls
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(listPeople);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  xlsx.writeFile(workbook, "lista_servidores_municipio_campos.xlsx");

  console.log("Arquivo XLS salvo com sucesso:");
  /////////////////
  await browser.close();
}
initialize();
