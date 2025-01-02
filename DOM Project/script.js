const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const nameInput = document.getElementById('name');
        const amountInput = document.getElementById('amount');
        const addParticipantButton = document.getElementById('addParticipant');
        const participantsTableBody = document.querySelector('#participantsTable tbody');
        const resultsDiv = document.getElementById('results');

        let participants = [];

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            body.classList.toggle('light');

            const isDarkMode = body.classList.contains('dark');
            themeToggle.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            nameInput.classList.toggle('dark', isDarkMode);
            amountInput.classList.toggle('dark', isDarkMode);
            resultsDiv.classList.toggle('dark', isDarkMode);
        });

        function renderTable() {
            participantsTableBody.innerHTML = '';
            participants.forEach((participant, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${participant.name}</td>
                    <td>${participant.amount}</td>
                    <td><button onclick="removeParticipant(${index})">Remove</button></td>
                `;
                participantsTableBody.appendChild(row);
            });

            calculateResults();
        }

        function calculateResults() {
            if (participants.length === 0) {
                resultsDiv.innerHTML = '<p>No data yet. Add participants and their expenses!</p>';
                return;
            }

            const totalAmount = participants.reduce((sum, p) => sum + p.amount, 0);
            const perPerson = totalAmount / participants.length;

            const resultsHTML = participants
                .map(p => {
                    const balance = (p.amount - perPerson).toFixed(2);
                    return `<p>${p.name} ${balance >= 0 ? 'is owed' : 'owes'} ₹${Math.abs(balance)}</p>`;
                })
                .join('');

            resultsDiv.innerHTML = resultsHTML;
        }

        function removeParticipant(index) {
            participants.splice(index, 1);
            renderTable();
        }

        addParticipantButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const amount = parseFloat(amountInput.value);

            if (!name || isNaN(amount) || amount <= 0) {
                alert('Please enter a valid name and amount.');
                return;
            }

            participants.push({ name, amount });
            nameInput.value = '';
            amountInput.value = '';

            renderTable();
        });

        renderTable();