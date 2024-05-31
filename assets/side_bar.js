function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('active');
        }

        function hideSidebar(event) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }

        document.addEventListener('click', function(event) {
            const sidebar = document.getElementById('sidebar');
            const toggleButton = document.querySelector('.toggle-btn');
            if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }
        });
