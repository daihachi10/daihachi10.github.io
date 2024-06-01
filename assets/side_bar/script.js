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



             // スクロールするとボタンを表示する
        window.onscroll = function() {scrollFunction()};

        function scrollFunction() {
            const topButton = document.getElementById("topButton");
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                topButton.style.display = "block";
            } else {
                topButton.style.display = "none";
            }
        }

        // ボタンをクリックするとページの上部に滑らかに戻る
        function topFunction() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
