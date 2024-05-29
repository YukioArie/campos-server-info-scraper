import xlsx from "xlsx";
import fs from "fs";


function initialize() {

    // Caminho do arquivo JSON na raiz do projeto
    const jsonFilePath = './list_all_data.json';
    const xlsxFilePath = './lista_de_servidores_do_municipio_de_campos_dos_goytacazes.xlsx';

    // Ler o arquivo JSON
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Converter JSON para planilha
    const worksheet = xlsx.utils.json_to_sheet(jsonData);

    // Criar um novo livro de trabalho
    const workbook = xlsx.utils.book_new();

    // Adicionar a planilha ao livro de trabalho
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Escrever o livro de trabalho em um arquivo XLSX
    xlsx.writeFile(workbook, xlsxFilePath);

    console.log(`Arquivo XLSX criado com sucesso: ${xlsxFilePath}`);


}
initialize();
