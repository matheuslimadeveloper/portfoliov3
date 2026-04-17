# Deploy para Hostinger

## Passos para fazer deploy:

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Gerar build estático:**
   ```bash
   npm run build
   ```

3. **Resultado:**
   - A pasta `out` será gerada com todos os arquivos estáticos
   - Esta pasta contém seu site completo pronto para upload

4. **Upload na Hostinger:**
   - Acesse o painel da Hostinger
   - Vá em File Manager
   - Navegue até `public_html`
   - Delete tudo dentro de `public_html`
   - Faça upload de **todo o conteúdo** da pasta `out`
   - Importante: Faça upload do **conteúdo** da pasta out, não a pasta out em si

5. **Domínio:**
   - Configure seu domínio para apontar para public_html
   - Aguarde propagação DNS (pode levar até 24h)

## Observações:

- O painel admin foi removido (não funciona em modo estático)
- Todas as configurações agora vêm do arquivo `lib/config-data.ts`
- Para editar projetos/configurações, edite `lib/config-data.ts` e faça novo build
- O site é 100% estático, ideal para performance e SEO
