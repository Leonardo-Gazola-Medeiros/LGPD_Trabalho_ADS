const insertDefaultValues = {
    termos: `
        INSERT INTO termos(texto)
        VALUES 
        ("Consentimento de Cookies e Proteção de Dados Ao se cadastrar em nosso site, você concorda com o uso de cookies e com a nossa Política de Privacidade conforme descrito abaixo. Cookies Utilizamos cookies para melhorar sua experiência em nosso site, personalizar conteúdos e anúncios, fornecer funcionalidades de redes sociais e analisar nosso tráfego. Cookies são pequenos arquivos de texto que são armazenados em seu dispositivo quando você visita um site. Eles nos ajudam a lembrar suas preferências e a melhorar a sua navegação. Você pode optar por não aceitar cookies, ajustando as configurações do seu navegador. No entanto, isso pode afetar a funcionalidade e a experiência geral em nosso site. Política de Privacidade e LGPD Estamos comprometidos com a proteção de seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD). Coletamos, usamos e armazenamos suas informações de acordo com nossa Política de Privacidade, que descreve como seus dados são coletados, utilizados, armazenados e compartilhados. Seus dados pessoais são utilizados exclusivamente para os fins para os quais foram coletados e são protegidos contra acesso não autorizado. Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Para mais informações sobre como exercitar seus direitos ou sobre como seus dados são tratados, consulte nossa [Política de Privacidade](link para a política de privacidade).")  
    `
}

const insertDefaulConditions = {
    conditions: `
        INSERT INTO condicoes(version_id,nome,obrigatorio)
        VALUES 
        (1, 'Armazenar informações do dispositivo', 0),
        (1, 'Uso dos dados do usuário', 0),
        (1, 'Criar perfis de anuncio personalizado', 0),
        (1, 'Usar perfis para anuncios personalizados', 0),
        (1, 'Desenvolver e aprimorar serviços com base nos dados', 0)
    `
}

const insertDefaultUser = {
    users: `
        INSERT INTO users(username,senha,email)
        VALUES
        ('admin','admin','admin@admin.com'),
        ('leo','leo','leo@leo.com'),
        ('pedro','pedro','pedro@pedro.com'),
        ('gustavo','gustavo','gustavo@gustavo.com')
    `
}

const insertDefaultUserPermissions = {
    permissions: `
        INSERT INTO usuario_termo(id_user,id_termo,aceito)
        VALUES
        (1,1,1),
        (2,1,1),
        (3,1,1),
        (4,1,1)
    `
}



module.exports = { insertDefaultValues, insertDefaulConditions, insertDefaultUser, insertDefaultUserPermissions }