require 'puppeteer-ruby'

Puppeteer.launch(headless: false) do |browser|
  page = browser.new_page
  page.goto("http://riodejaneiro1.dcfiorilli.com.br:8079/Transparencia/servidores.aspx")


  # Espera até que o campo de entrada esteja disponível com um timeout maior
  begin
    page.wait_for_selector('#divIntegracao', timeout: 5_000)
  rescue Puppeteer::WaitTask::TimeoutError
    puts "O seletor #divPaginaHome não foi encontrado dentro do tempo limite."
    browser.close
    exit
  end

  # # Verifica se o elemento realmente existe
  # if page.query_selector('#divPaginaHome')
  #   # Remove o atributo readonly
  #   page.evaluate('document.querySelector("input[name=\'cmbMes\']").removeAttribute("readonly");')

  #   # Define o valor desejado
  #   page.type('input[name="cmbMes"]', 'Fevereiro')

  #   # Aguarda o botão estar disponível e clica nele
  #   page.wait_for_selector('input[name="btnPesquisar"]')
  #   page.click('input[name="btnPesquisar"]')

  #   puts "O navegador está aberto. Pressione ENTER para fechar."
  #   gets
  # else
  #   puts "O seletor input[name='cmbMes'] não foi encontrado na página."
  # end

  browser.close
end
