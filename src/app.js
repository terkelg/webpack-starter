import './styles.scss'

const sayHello = name => `Hello ${name} 🎉`

// Test code splitting
System.import('./split.js').then(result => console.log('loaded split!'))


console.log(sayHello('World'))
