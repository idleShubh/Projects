const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const nameInput = document.getElementById('name');
        const amountInput = document.getElementById('amount');
        const addParticipantButton = document.getElementById('addParticipant');
        const participantsTableBody = document.querySelector('#participantsTable tbody');
        const resultsDiv = document.getElementById('results');
        const currencySelect = document.getElementById('currencySelect');

        let participants = [];

        const currencies = {
            'INR': '₹',
            'USD': '$',
            'EUR': '€',
            'GBP': '£'
        };

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
                    <td>${currencies[participant.currency]}${participant.amount}</td>
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

            const byCurrency = participants.reduce((acc, p) => {
                if (!acc[p.currency]) acc[p.currency] = [];
                acc[p.currency].push(p);
                return acc;
            }, {});

            const resultsHTML = Object.entries(byCurrency).map(([currency, group]) => {
                const totalAmount = group.reduce((sum, p) => sum + p.amount, 0);
                const perPerson = totalAmount / group.length;
                
                const groupResults = group
                    .map(p => {
                        const balance = (p.amount - perPerson).toFixed(2);
                        if (balance == 0) {
                            return `<p>${p.name} has paid the whole amount of ${currencies[currency]}${Math.abs(balance)}</p>`;
                        }
                        return `<p>${p.name} ${balance >= 0 ? 'has given extra' : 'owes'} ${currencies[currency]}${Math.abs(balance)}</p>`;
                    })
                    .join('');
                
                return `<h3>${currency} Group</h3>${groupResults}`;
            }).join('');

            resultsDiv.innerHTML = resultsHTML;
        }

        function removeParticipant(index) {
            participants.splice(index, 1);
            renderTable();
        }

        addParticipantButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const amount = parseFloat(amountInput.value);
            const currency = currencySelect.value;

            if (!name || isNaN(amount) || amount <= 0) {
                alert('Please enter a valid name and amount.');
                return;
            }

            participants.push({ name, amount, currency });
            nameInput.value = '';
            amountInput.value = '';

            renderTable();
        });

        renderTable();