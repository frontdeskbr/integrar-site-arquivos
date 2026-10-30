# Revisão da independência e do painel editorial

Data: 30/10/2026. Estado: implementação preparada no Git, ainda não aplicada nem publicada no Floot por limite diário de 100 ações. Liberação informada pelo provedor: 30/10/2026, 20h de Brasília.

## O que já está publicado

- ANE: https://ane-esportes.floot.app — 642 notícias e 14 páginas na exportação pública.
- Integrar: https://integrar-arte-e-vida.floot.app — 221 notícias e 21 páginas na exportação pública.
- Páginas e notícias consultam arquivos arquivados no GitHub Pages, não o WordPress. Recursos públicos estão em releases v1.0.0 nos respectivos repositórios.
- Busca de notícias com filtros e ordenação; leitor independente para quatro edições do gibi.
- Formulários próprios, validação e persistência em banco Floot. Envio válido e rejeição de dados inválidos verificados; teste real pela interface do Integrar confirmou gravação. Registros de teste removidos.
- Mapa da página de contato restaurado a partir do shortcode público original.

## Operações já aplicadas nesta etapa, ainda sem publicação da autenticação

- Recursos de autenticação e login Google provisionados nos dois projetos.
- Tabelas de conteúdo e arquivos criadas sem apagar o acervo ou os contatos.
- Contas marcelo@ane.org.br, vanessa@ane.org.br e ane@ane.org.br criadas com papel admin nos dois bancos. Conta do proprietário do projeto preservada.
- A configuração atual do OAuth cria outras contas com papel user, que não concede acesso ao painel.

## Implementação preparada em cms-admin-staged.json

- /admin com login Google e recuperação por senha acessível como alternativa.
- Acesso negado para contas sem papel admin. Autorização conferida no servidor em cada leitura ou escrita administrativa.
- Notícias e páginas existentes lidas do arquivo do Git, com alterações e novos conteúdos no banco próprio.
- Editor visual, HTML opcional, título, endereço, resumo, imagem, categorias, situação e data.
- Publicação, rascunho e lixeira reversível. Revisão numérica impede sobrescrever uma edição concorrente.
- Pesquisa, filtros, paginação e interface adaptada a celular.
- Biblioteca com imagens/PDFs do acervo e uploads novos. Upload direto para storage, arquivo até 20 MB, formato permitido e confirmação de tamanho no servidor. Nenhum binário passa pelo banco.
- Contatos recebidos visíveis somente a administradores.
- Administradores podem autorizar ou revogar outras contas cadastradas. Contas administrativas iniciais e acesso do proprietário são preservados.
- Exportação JSON do conteúdo e metadados do CMS. A exportação não inclui binários, credenciais ou mensagens privadas.
- Adaptadores públicos integram novas publicações ao site, à busca e à listagem de notícias; rascunhos e lixeira não ficam públicos.
- HTML editado passa por sanitização, com scripts e manipuladores de eventos removidos e iframes restritos a provedores conhecidos.

## Velocidade: melhoria preparada, medição pendente

O código preparado resolve URLs de imagens e scripts diretamente para o GitHub Pages quando o recurso consta do mapa arquivado, reduzindo redirecionamentos pelo servidor Floot. O mapa fica em cache no navegador, tem espera limitada e falha sem bloquear o conteúdo. Imagens fora da primeira área usam lazy loading e decodificação assíncrona. O carregamento de plugins antigos de formulário e busca WordPress continua desativado.

Não há comparação de desempenho antes/depois: essa melhoria ainda não foi aplicada nem medida. Dados administrativos usam no-store para impedir cache de informações privadas. Publicações novas priorizam atualização imediata; reavaliar cache de leitura depois de medir latência e volume.

## O que falta para considerar completo

1. Recuperar os arquivos internos completos da quinta edição do gibi. O arquivo público tem apenas parte da edição; não substituir por outro PDF nem inventar páginas.
2. Recuperar imagens históricas que não estavam disponíveis no arquivo público. Manter a lista de ausências e comparar com uploads do backup completo.
3. Obter/verificar backup privado completo dos WordPress, com banco, uploads, temas e plugins. Nunca publicar esse backup ou credenciais nos repositórios públicos.
4. Aplicar o pacote de 22 arquivos por projeto, executar typecheck e corrigir os problemas encontrados antes de publicar.
5. Testar /admin sem sessão (nenhuma informação privada), conta comum (403 em leituras e escritas), Google com os administradores, publicação real, retirada para rascunho, restauração da lixeira, conflito de revisão, upload e permissões.
6. Verificar que mudanças aparecem no site público e na busca, sem necessidade de republicar o código e sem chamadas ao WordPress. Repetir em celular.
7. Configurar envio de notificações dos contatos e caixas de e-mail. Login Google não cria caixas postais. Nenhuma caixa foi confirmada como migrada; marcelo@anvp.com.br não foi configurado nesta etapa.
8. Medir desempenho e comparar páginas representativas, imagens, fontes, notícias e PDFs. Comparação visual integral ainda não concluída.
9. Implementar rotina de backup dos dados novos: posts novos e uploads não são enviados automaticamente ao Git. O arquivo JSON exportado preserva metadados; copiar também os binários para um backup independente.

## Preservação

WordPress não é necessário para servir o conteúdo público já arquivado, mas continua sendo uma fonte possível para os itens ausentes. Não apagar a única cópia de conteúdo faltante. Os domínios temporários attentive/charming são instalações WordPress separadas, não os sites Floot. DNS e caixas postais devem ser tratados separadamente.

O pacote foi revisado estruturalmente, mas não compilado nem validado em integração. Não marcar 100% ou painel publicado até os testes acima passarem.
