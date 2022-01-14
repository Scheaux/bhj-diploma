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
            formData.append('email', options.data.email);
            formData.append('password', options.data.password);
            xhr.open(options.method, options.url);
            xhr.send(formData);
        } else {
            xhr.open(options.method, `${options.url}?mail=${options.data.email}?password=${options.data.password}`);
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
