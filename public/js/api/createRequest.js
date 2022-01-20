/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.responseType = "json";
    const callback = (err, response) => {};
    this.options = {
        callback
    }

    try {
        if (options.method != 'GET') {
            for (let i = 0; i < Object.keys(options.data).length; i++) {
                let key = Object.keys(options.data)[i];
                let value = Object.values(options.data)[i];
                
                formData.append(key, value);
            }

            xhr.open(options.method, options.url);
            xhr.send(formData);
        } else {
            let url = options.url;

            for (let i = 0; i < Object.keys(options.data).length; i++) {
                let key = Object.keys(options.data)[i];
                let value = Object.values(options.data)[i];

                if (key === '0') key = 'id';

                if (i === 0) {
                    url += `?${key}=${value}`;
                } else {
                    url += `&${key}=${value}`;
                }
            }

            xhr.open(options.method, url);
            xhr.send();
        }
    } catch (err) {
        callback(err);
    }

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === xhr.DONE) {
            options.callback(null, xhr.response);
        }
    });
};
