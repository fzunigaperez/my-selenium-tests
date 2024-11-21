//  WE NEED THIS BLOCK FOR RUNNING LOCAL
if (require.main === module) {
    (async () => {
      try {
        console.log(`'🚀 Ejecutando el test `);
        await C90();   // Change here the test name
        
        console.log('✅ Test completado con éxito.');
      } catch (error) {
        console.error('❌ Error al ejecutar el test:', error.message);
      }
    })();
  }