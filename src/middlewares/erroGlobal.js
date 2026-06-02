export function mostrarErro(erro, req, res, next) {
    console.error(erro)
    return res.status(500).json({ 'Erro' : 'Erro interno no servidor. Tente novamente mais tarde.'})
}