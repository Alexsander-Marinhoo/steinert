import { supabase } from './supabase.js';

function showPopup(message, isSuccess = true) {
    const existing = document.getElementById('contact-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'contact-popup';
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

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            popup.classList.remove('translate-y-24', 'opacity-0');
        });
    });

    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.classList.add('translate-y-24', 'opacity-0');
            setTimeout(() => popup.remove(), 500);
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('agendamento-form');
    if (!form) return;

    const dataInput = document.getElementById('agendamento-data');
    const dataAviso = document.getElementById('agendamento-data-aviso');
    const periodoContainer = document.getElementById('periodo-container');
    let selectedPeriodo = null;

    // Bloquear datas passadas limitando o input date
    const today = new Date();
    // Ajustar fuso local
    const localDate = new Date(today.getTime() - (today.getTimeOffset ? today.getTimezoneOffset() * 60000 : 0)).toISOString().split('T')[0];
    dataInput.min = localDate;

    // Função para gerar os horários
    function generateTimeSlots(dayOfWeek) {
        const slots = [];
        const startHour = 9;
        const endHour = (dayOfWeek === 6) ? 13 : 18; // Sábado até 13h, Dias de semana até 18h

        // Vai até endHour - 1 (ex: de 9h até as 17h, durando até 18h)
        for (let i = startHour; i < endHour; i++) {
            const timeString = `${i.toString().padStart(2, '0')}:00`;
            slots.push(timeString);
        }
        return slots;
    }

    // Função para desenhar os botões
    function renderTimeSlots(slots) {
        periodoContainer.innerHTML = '';
        if (slots.length === 0) {
            periodoContainer.innerHTML = '<p class="text-xs text-on-surface-variant col-span-full">Nenhum horário disponível para este dia.</p>';
            return;
        }

        slots.forEach(time => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.periodo = time;
            btn.className = 'periodo-btn py-3 px-4 rounded-lg bg-surface-container-high ghost-border text-sm font-medium hover:bg-primary-container hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
            btn.textContent = time;

            btn.addEventListener('click', () => {
                if (btn.disabled) return;

                const allBtns = document.querySelectorAll('.periodo-btn');
                allBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-white');
                    b.classList.add('bg-surface-container-high');
                });
                btn.classList.add('bg-primary', 'text-white');
                btn.classList.remove('bg-surface-container-high');
                selectedPeriodo = btn.dataset.periodo;
            });

            periodoContainer.appendChild(btn);
        });
    }

    // Validar dias ao mudar a data
    dataInput.addEventListener('change', async () => {
        const selectedDate = dataInput.value;
        dataAviso.classList.add('hidden');
        selectedPeriodo = null;
        periodoContainer.innerHTML = '<p class="text-xs text-on-surface-variant col-span-full">Carregando horários...</p>';

        if (!selectedDate) {
            periodoContainer.innerHTML = '<p class="text-xs text-on-surface-variant col-span-full">Selecione uma data primeiro para ver os horários.</p>';
            return;
        }

        // Trata a data para extrair o dia da semana corretamente sem erro de fuso
        const dateParts = selectedDate.split('-');
        const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const dayOfWeek = dateObj.getDay();

        // 0 é Domingo
        if (dayOfWeek === 0) {
            dataAviso.textContent = "A clínica não abre aos domingos. Escolha outra data.";
            dataAviso.classList.remove('hidden');
            dataInput.value = '';
            periodoContainer.innerHTML = '<p class="text-xs text-on-surface-variant col-span-full">Clínica fechada aos domingos.</p>';
            return;
        }

        const availableSlots = generateTimeSlots(dayOfWeek);
        renderTimeSlots(availableSlots);

        // Verificar disponibilidade no Supabase
        dataAviso.textContent = "Verificando disponibilidade...";
        dataAviso.classList.remove('hidden', 'text-red-500');
        dataAviso.classList.add('text-blue-500');

        const { data: ocupados, error } = await supabase
            .from('agendamentos')
            .select('periodo')
            .eq('data_agendamento', selectedDate);

        dataAviso.classList.add('hidden');
        dataAviso.classList.remove('text-blue-500');
        dataAviso.classList.add('text-red-500');

        if (error) {
            console.error('Erro ao buscar disponibilidade', error);
            dataAviso.textContent = "Erro ao carregar horários. Tente recarregar a página.";
            dataAviso.classList.remove('hidden');
            return;
        }

        // Bloqueia horários ocupados
        if (ocupados && ocupados.length > 0) {
            const allBtns = document.querySelectorAll('.periodo-btn');
            ocupados.forEach(ocupado => {
                const btn = document.querySelector(`.periodo-btn[data-periodo="${ocupado.periodo}"]`);
                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed', 'line-through');
                }
            });

            // Verificar se todos os botões ficaram desabilitados
            const allDisabled = Array.from(allBtns).every(b => b.disabled);
            if (allDisabled) {
                dataAviso.textContent = "Todos os horários desta data já estão agendados.";
                dataAviso.classList.remove('hidden');
            }
        }
    });

    // Enviar formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedPeriodo) {
            showPopup('Por favor, escolha um Horário de Preferência.', false);
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;
        btn.innerText = 'Processando...';
        btn.disabled = true;

        const nome = document.getElementById('agendamento-nome').value;
        const whatsapp = document.getElementById('agendamento-whatsapp').value;
        const especialidade = document.getElementById('agendamento-especialidade').value;
        const data_agendamento = dataInput.value;

        // Double check no Supabase por segurança
        const { data: checkData, error: checkError } = await supabase
            .from('agendamentos')
            .select('id')
            .eq('data_agendamento', data_agendamento)
            .eq('periodo', selectedPeriodo);

        if (checkData && checkData.length > 0) {
            showPopup('Desculpe, este horário acabou de ser agendado. Escolha outro.', false);
            btn.innerText = originalBtnText;
            btn.disabled = false;
            // Atualiza a tela para forçar re-validação
            dataInput.dispatchEvent(new Event('change'));
            return;
        }

        const { error } = await supabase
            .from('agendamentos')
            .insert([
                { nome, whatsapp, especialidade, data_agendamento, periodo: selectedPeriodo }
            ]);

        if (error) {
            console.error('Erro ao agendar:', error);
            showPopup('Ocorreu um erro ao realizar seu agendamento. Tente novamente.', false);
            btn.innerText = originalBtnText;
            btn.disabled = false;
        } else {
            showPopup('Agendamento confirmado com sucesso!', true);
            form.reset();
            periodoContainer.innerHTML = '<p class="text-xs text-on-surface-variant col-span-full">Selecione uma data primeiro para ver os horários.</p>';
            selectedPeriodo = null;
            btn.innerText = originalBtnText;
            btn.disabled = false;
        }
    });
});
