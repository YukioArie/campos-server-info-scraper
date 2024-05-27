import puppeteer from "puppeteer";
import XLSX from "xlsx";

async function initialize() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "http://riodejaneiro1.dcfiorilli.com.br:8079/Transparencia/Default.aspx?AcessoIndividual=LnkServidores"
  );
  await page.setViewport({ width: 1920, height: 1080 });
  await page.waitForSelector("#cmbEntidadeContabil");

  await page.hover("#cmbEntidadeContabil_B-1");

  try {
    await page.waitForSelector(".dxeButtonEditButtonHover_DevEx", {
      timeout: 3000,
    });
  } catch (e) {
    // console.log(e);
    await page.hover("#cmbEntidadeContabil_B-1");
    await page.waitForSelector(".dxeButtonEditButtonHover_DevEx", {
      timeout: 3000,
    });
  }

  await page.click("#cmbEntidadeContabil_B-1");

  await page.waitForSelector("#cmbEntidadeContabil_DDD_L_D");

  const elements = await page.$$(
    "#cmbEntidadeContabil_DDD_L_D > table > tbody > tr > td "
  );
  let i = 0;
  // let nameEntity = "";
  for (const element of elements) {
    if (i > 0) {
      if (i === 1) {
        const id = await element.evaluate((el) => el.id);
        await page.hover("#" + id);
        await page.click("#" + id);
        await page.waitForSelector("#divPaginaConteudoHome", {
          timeout: 3000,
        });
      } else {
        await page.waitForSelector("#cmbEntidadeContabil", {
          timeout: 15000,
        });
        await page.waitForSelector("#cmbEntidadeContabil_B-1", {
          timeout: 15000,
        });
        await page.hover("#cmbEntidadeContabil_B-1");
        try {
          await page.waitForSelector(".dxeButtonEditButtonHover_DevEx", {
            timeout: 3000,
          });
        } catch (e) {
          // console.log(e);
          await page.hover("#cmbEntidadeContabil_B-1");
          await page.waitForSelector(".dxeButtonEditButtonHover_DevEx", {
            timeout: 3000,
          });
        }
        await page.click("#cmbEntidadeContabil_B-1");
        await page.waitForSelector("#cmbEntidadeContabil_DDD_L_D", {
          timeout: 5000,
        });

        const id = await element.evaluate((el) => el.id);

        console.log(id);
        await page.hover("#" + id);
        await page.click("#" + id);

        console.log("clicou");
        // await page.waitForNavigation();
        await page.waitForSelector("#divPaginaConteudoHome", {
          timeout: 5000,
        });
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

  //   await page.click("#cmbEntidadeContabil_B-1");

  // await page.waitForSelector("#cmbEntidadeContabil_DDD_L_LBT", {
  //   timeout: 5000,
  // });
  // await page.waitForSelector("#cmbEntidadeContabil_DDD_L_LBT", {
  //   timeout: 5000,
  // });
  // const entity = await page.$$eval(
  //   "#cmbEntidadeContabil_DDD_L_D > table > tbody >tr"
  // );
  // const entity = await page.evaluate(() => {
  //   const el = document.querySelectorAll(
  //     "#cmbEntidadeContabil_DDD_L_D > table > tbody > tr"
  //   );
  //   // const el = document.querySelectorAll(".dxeListBoxItemRow_DevEx");

  //   return el;
  // });
  // console.log(elements);
  // console.log(entity);
}
initialize();
