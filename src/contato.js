import { supabase } from './supabase.js';

function showPopup(message, isSuccess = true) {
    // Remove existing popup if any
    const existing = document.getElementById('contact-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'contact-popup';
    // Estilos usando Tailwind
    popup.className = `fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 transform translate-y-24 opacity-0 ${isSuccess ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-red-50 text-red-900 border border-red-200'}`;
    
    const icon = isSuccess ? 'check_circle' : 'error';
    const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';

    popup.innerHTML = `
        <span class="material-symbols-outlined ${iconColor} text-3xl">${icon}</span>
        <p class="font-medium text-sm md:text-base whitespace-nowrap">${message}</p>
        <button onclick="this.parentElement.remove()" class="ml-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
            <span class="material-symbols-outlined text-xl">close</span>
        </button>
    `;

    document.body.appendChild(popup);

    // Animação de entrada
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            popup.classList.remove('translate-y-24', 'opacity-0');
        });
    });

    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.classList.add('translate-y-24', 'opacity-0');
            setTimeout(() => popup.remove(), 500);
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalBtnText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;
            
            // Get values from inputs (works for both index.html and contato.html)
            const nomeInput = document.getElementById('nome');
            const telefoneInput = document.getElementById('telefone');
            const mensagemInput = document.getElementById('mensagem');
            
            if(!nomeInput || !telefoneInput || !mensagemInput) {
                console.error("Campos do formulário não encontrados");
                btn.innerText = originalBtnText;
                btn.disabled = false;
                return;
            }

            const nome = nomeInput.value;
            const telefone = telefoneInput.value;
            const mensagem = mensagemInput.value;
            
            const { data, error } = await supabase
                .from('contatos')
                .insert([
                    { nome, telefone, mensagem }
                ]);
                
            if (error) {
                console.error('Erro ao enviar contato:', error);
                showPopup('Ocorreu um erro ao enviar sua mensagem. Tente novamente.', false);
                btn.innerText = originalBtnText;
                btn.disabled = false;
            } else {
                showPopup('Enviado com sucesso! Entraremos em contato em breve.', true);
                contactForm.reset();
                btn.innerText = originalBtnText;
                btn.disabled = false;
            }
        });
    }
});
