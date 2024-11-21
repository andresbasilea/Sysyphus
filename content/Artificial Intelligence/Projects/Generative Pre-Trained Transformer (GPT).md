
> [!info] Transformer Architecture
> A transformer is a deep learning architecture developed by researchers at Google and based on the multi-head attention mechanism, proposed in the 2017 paper "Attention Is All You Need". Text is converted to numerical representations called tokens, and each token is converted into a vector via lookup from a word embedding table. At each layer, each token is then contextualized within the scope of the context window with other (unmasked) tokens via a parallel multi-head attention mechanism, allowing the signal for key tokens to be amplified and less important tokens to be diminished.
> 
> Transformers have the advantage of having no recurrent units, therefore requiring less training time than earlier recurrent neural architectures (RNNs) such as long short-term memory (LSTM). [Wikipedia](https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture))

> [!info] Generative Pre-Trained Transformer
> A generative pre-trained transformer (GPT) is a type of large language model (LLM) and a prominent framework for generative artificial intelligence. It is an artificial neural network that is used in natural language processing by machines. It is based on the transformer deep learning architecture, pre-trained on large data sets of unlabeled text, and able to generate novel human-like content. [Wikipedia](https://en.wikipedia.org/wiki/Generative_pre-trained_transformer)


# GPT

This notebook is a simple and clean implementation of GPT (Generative Pre-trained Transformer).  The complete code can be found in [this repository](https://github.com/milmor/GPT).


```python
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' # Disable tensorflow debugging logs
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.layers import TextVectorization
import numpy as np
import os
import re
import string
import random
import time
```

## 1.- Dataset


```python
# Download the file
import pathlib

path_to_zip = tf.keras.utils.get_file(
    'spa-eng.zip', origin='http://storage.googleapis.com/download.tensorflow.org/data/spa-eng.zip',
    extract=True)

path_to_file = pathlib.Path(path_to_zip).parent/'spa-eng/spa.txt'

# def load_data(path):
#     text = path.read_text(encoding='utf-8')

#     lines = text.splitlines()
#     pairs = [line.split('\t') for line in lines]

#     inp = ['spanish sentence = ' + inp + ' english sentence = ' + targ + ' [END]' for targ, inp in pairs]
#     inp = ['english sentence = ' + inp + ' spanish sentence = ' + targ + ' [END]' for targ, inp in pairs]

#     return inp
```

    Downloading data from http://storage.googleapis.com/download.tensorflow.org/data/spa-eng.zip
    2638744/2638744 [==============================] - 0s 0us/step



```python
text = path_to_file.read_text(encoding='utf-8')

lines = text.splitlines()
pairs = [line.split('\t') for line in lines]
```


```python
pairs
```




    [['Go.', 'Ve.'],
     ['Go.', 'Vete.'],
     ['Go.', 'Vaya.'],
     ['Go.', 'Váyase.'],
     ['Hi.', 'Hola.'],
     ['Run!', '¡Corre!'],
     ['Run.', 'Corred.'],
     ['Who?', '¿Quién?'],
     ['Fire!', '¡Fuego!'],
     ['Fire!', '¡Incendio!'],
     ['Fire!', '¡Disparad!'],
     ['Help!', '¡Ayuda!'],
     ['Help!', '¡Socorro! ¡Auxilio!'],
     ['Help!', '¡Auxilio!'],
     ['Jump!', '¡Salta!'],
     ['Jump.', 'Salte.'],
     ['Stop!', '¡Parad!'],
     ['Stop!', '¡Para!'],
     ['Stop!', '¡Pare!'],
     ['Wait!', '¡Espera!'],
     ['Wait.', 'Esperen.'],
     ['Go on.', 'Continúa.'],
     ['Go on.', 'Continúe.'],
     ['Hello!', 'Hola.'],
     ['I ran.', 'Corrí.'],
     ['I ran.', 'Corría.'],
     ['I try.', 'Lo intento.'],
     ['I won!', '¡He ganado!'],
     ['Oh no!', '¡Oh, no!'],
     ['Relax.', 'Tomátelo con soda.'],
     ['Smile.', 'Sonríe.'],
     ['Attack!', '¡Al ataque!'],
     ['Attack!', '¡Atacad!'],
     ['Get up.', 'Levanta.'],
     ['Go now.', 'Ve ahora mismo.'],
     ['Got it!', '¡Lo tengo!'],
     ['Got it?', '¿Lo pillas?'],
     ['Got it?', '¿Entendiste?'],
     ['He ran.', 'Él corrió.'],
     ['Hop in.', 'Métete adentro.'],
     ['Hug me.', 'Abrázame.'],
     ['I fell.', 'Me caí.'],
     ['I know.', 'Yo lo sé.'],
     ['I left.', 'Salí.'],
     ['I lied.', 'Mentí.'],
     ['I lost.', 'Perdí.'],
     ['I quit.', 'Dimito.'],
     ['I quit.', 'Renuncié.'],
     ['I work.', 'Estoy trabajando.'],
     ["I'm 19.", 'Tengo diecinueve.'],
     ["I'm up.", 'Estoy levantado.'],
     ['Listen.', 'Escucha.'],
     ['Listen.', 'Escuche.'],
     ['Listen.', 'Escuchen.'],
     ['No way!', '¡No puede ser!'],
     ['No way!', 'De ninguna manera.'],
     ['No way!', '¡De ninguna manera!'],
     ['No way!', '¡Imposible!'],
     ['No way!', '¡De ningún modo!'],
     ['No way!', '¡De eso nada!'],
     ['No way!', '¡Ni cagando!'],
     ['No way!', '¡Mangos!'],
     ['No way!', '¡Minga!'],
     ['No way!', '¡Ni en pedo!'],
     ['Really?', '¿En serio?'],
     ['Really?', '¿La verdad?'],
     ['Thanks.', '¡Gracias!'],
     ['Thanks.', 'Gracias.'],
     ['Try it.', 'Pruébalo.'],
     ['We try.', 'Lo procuramos.'],
     ['We won.', 'Ganamos.'],
     ['Why me?', '¿Por qué yo?'],
     ['Ask Tom.', 'Pregúntale a Tom.'],
     ['Awesome!', '¡Órale!'],
     ['Be calm.', 'Mantente en calma.'],
     ['Be cool.', 'Estate tranquilo.'],
     ['Be fair.', 'Sé justo.'],
     ['Be kind.', 'Sean gentiles.'],
     ['Be nice.', 'Sé agradable.'],
     ['Beat it.', 'Pírate.'],
     ['Call me.', 'Llamame.'],
     ['Call me.', 'Llamadme.'],
     ['Call me.', 'Llámame.'],
     ['Call us.', 'Llámanos.'],
     ['Come in.', 'Entre.'],
     ['Come in.', 'Pase.'],
     ['Come in.', '¡Entren!'],
     ['Come on!', '¡Órale!'],
     ['Come on.', 'Ándale.'],
     ['Come on.', '¡Órale!'],
     ['Drop it!', 'Suéltalo.'],
     ['Get Tom.', 'Agarra a Tom.'],
     ['Get out!', 'Bájate.'],
     ['Get out.', 'Salte.'],
     ['Get out.', 'Sal.'],
     ['Get out.', 'Salí.'],
     ['Get out.', 'Salid.'],
     ['Get out.', 'Salgan.'],
     ['Go away!', '¡Vete de aquí!'],
     ['Go away!', '¡Lárgate!'],
     ['Go away!', '¡Salga de aquí!'],
     ['Go away!', '¡Largo!'],
     ['Go away!', '¡Vete ya!'],
     ['Go away!', '¡Órale!'],
     ['Go away!', '¡A la calle!'],
     ['Go away.', '¡Vete de aquí!'],
     ['Go away.', '¡Lárgate!'],
     ['Go away.', '¡Largo!'],
     ['Go away.', '¡Vete ya!'],
     ['Go away.', '¡Órale!'],
     ['Go away.', 'Lárguese.'],
     ['Go away.', 'Váyase.'],
     ['Go home.', 'Vete a casa.'],
     ['Go slow.', 'Vaya despacio.'],
     ['Goodbye!', '¡Hasta luego!'],
     ['Goodbye!', 'Hasta la vista.'],
     ['Goodbye!', '¡Chau!'],
     ['Hang on!', '¡Espera!'],
     ['Hang on!', '¡Espera un momento!'],
     ['Hang on!', '¡Un segundo!'],
     ['Hang on.', 'Agarra fuertemente.'],
     ['He came.', 'Él vino.'],
     ['He quit.', 'Él renunció.'],
     ['Help me!', 'Ayúdame.'],
     ['Help me.', 'Ayúdame.'],
     ['Help me.', 'Échame una mano.'],
     ['Help me.', 'Ayudame.'],
     ['Help us.', 'Ayúdanos.'],
     ['Hit Tom.', 'Golpea a Tom.'],
     ['Hold it!', 'Espera.'],
     ['Hold on.', 'Resista.'],
     ['Hold on.', 'Resiste.'],
     ['Hold on.', 'Agarra fuertemente.'],
     ['Hug Tom.', 'Abraza a Tom.'],
     ['I agree.', 'Estoy de acuerdo.'],
     ['I agree.', 'De acuerdo.'],
     ['I bowed.', 'Me incliné.'],
     ['I moved.', 'Me he mudado.'],
     ['I moved.', 'Me mudé.'],
     ['I moved.', 'Me trasladé.'],
     ['I moved.', 'Me he trasladado.'],
     ['I slept.', 'Dormí.'],
     ['I tried.', 'Lo intenté.'],
     ["I'll go.", 'Iré.'],
     ["I'm Tom.", 'Soy Tom.'],
     ["I'm fat.", 'Estoy gordo.'],
     ["I'm fat.", 'Soy gorda.'],
     ["I'm fit.", 'Estoy en forma.'],
     ["I'm hit!", 'Estoy afectado.'],
     ["I'm old.", 'Soy viejo.'],
     ["I'm shy.", 'Soy tímido.'],
     ["I'm wet.", 'Estoy mojada.'],
     ["It's OK.", 'Está bien.'],
     ["It's me!", 'Soy yo.'],
     ["It's me.", 'Soy yo.'],
     ['Join us.', 'Únete a nosotros.'],
     ['Join us.', 'Sé parte nuestra.'],
     ['Keep it.', 'Guárdalo.'],
     ['Me, too.', 'Yo, también.'],
     ['Open up.', 'Abre.'],
     ['Perfect!', '¡Perfecto!'],
     ['See you.', 'Nos vemos.'],
     ['Show me.', 'Muéstramelo.'],
     ['Show me.', 'Enséñamelo.'],
     ['Show me.', 'Mostrame.'],
     ['Shut up!', '¡Cierra la boca!'],
     ['Shut up!', '¡Cerrá el pico!'],
     ['Skip it.', 'Sáltatelo.'],
     ['So long.', 'Hasta la vista.'],
     ['So long.', 'Hasta luego.'],
     ['Stop it.', 'Páralo.'],
     ['Stop it.', 'Deténlo.'],
     ['Take it.', 'Cógelo.'],
     ['Tell me.', 'Decime.'],
     ['Tom ate.', 'Tom comió.'],
     ['Tom ran.', 'Tom corrió.'],
     ['Tom won.', 'Tom ganó.'],
     ['Wait up.', 'Espérame despierto.'],
     ['Wake up!', '¡Despierta!'],
     ['Wake up!', '¡Despiértate!'],
     ['Wake up!', '¡Despertate!'],
     ['Wake up.', 'Despierta.'],
     ['Wash up.', 'Lávate las manos.'],
     ['We care.', 'Nos preocupamos.'],
     ['We know.', 'Lo sabemos.'],
     ['We lost.', 'Perdimos.'],
     ['Welcome.', 'Bienvenidos.'],
     ['Welcome.', 'Bienvenidas.'],
     ['Who ate?', '¿Quién comió?'],
     ['Who ran?', '¿Quién corría?'],
     ['Who ran?', '¿Quién corrió?'],
     ['Who won?', '¿Quién ganó?'],
     ['Who won?', '¿Quién ha ganado?'],
     ['Why not?', '¿Por qué no?'],
     ['You run.', 'Corre.'],
     ['You won.', 'Has ganado.'],
     ['Am I fat?', '¿Estoy gordo?'],
     ['Ask them.', 'Preguntales.'],
     ['Ask them.', 'Pregúntales.'],
     ['Back off!', 'Aparta.'],
     ['Back off.', 'Apártate.'],
     ['Be a man.', 'Sé un hombre.'],
     ['Be brave.', 'Sé fuerte.'],
     ['Be brief.', 'Sé breve.'],
     ['Be brief.', 'Sea breve.'],
     ['Be brief.', 'Sean breves.'],
     ['Be quiet.', 'Estate quieto.'],
     ['Be still.', 'No te muevas.'],
     ['Call Tom.', '¡Llamalo a Tomás!'],
     ['Call Tom.', '¡Llámalo a Tomás!'],
     ['Call Tom.', '¡Llámenlo a Tomás!'],
     ['Cheer up!', 'Anímate.'],
     ['Cheer up.', 'Venga.'],
     ['Cool off!', '¡Cálmate!'],
     ['Cuff him.', 'Espósale.'],
     ["Don't go.", 'No te vayas.'],
     ['Drive on.', 'Continúa.'],
     ['Find Tom.', 'Encontralo a Tomás.'],
     ['Find Tom.', 'Encuéntralo a Tomás.'],
     ['Find Tom.', 'Encuéntrelo a Tomás.'],
     ['Find Tom.', 'Encuéntrenlo a Tomás.'],
     ['Find Tom.', 'Encuentre a Tom.'],
     ['Find Tom.', 'Encuentren a Tom.'],
     ['Fix this.', 'Arregla esto.'],
     ['Get away!', '¡Vete de aquí!'],
     ['Get away!', '¡Lárgate!'],
     ['Get away!', '¡Largo!'],
     ['Get away!', '¡Vete ya!'],
     ['Get down!', 'Ponte a ello.'],
     ['Get down.', 'Abajo.'],
     ['Get down.', 'Túmbate.'],
     ['Get lost!', '¡Piérdete!'],
     ['Get lost!', '¡Vete de aquí!'],
     ['Get lost!', '¡Lárgate!'],
     ['Get lost!', '¡Largo!'],
     ['Get lost!', '¡Vete ya!'],
     ['Get lost.', 'Esfúmate.'],
     ['Get real!', '¡Despierta!'],
     ['Get real!', '¡Piénsalo bien!'],
     ['Get real.', 'Abre los ojos.'],
     ['Go ahead!', 'Adelante.'],
     ['Go ahead.', 'Adelante.'],
     ['Go on in.', 'Entre.'],
     ['Go on in.', 'Entra.'],
     ['Go on in.', 'Entren.'],
     ['Go on in.', 'Entrá.'],
     ['Go on in.', 'Entrad.'],
     ['Good job!', '¡Buen trabajo!'],
     ['Grab Tom.', 'Sujeta a Tom.'],
     ['Grab him.', 'Agárralo.'],
     ['Have fun.', 'Diviértanse.'],
     ['Have fun.', 'Pásala bien.'],
     ['Have fun.', 'Pásenla bien.'],
     ['He spoke.', 'Él habló.'],
     ['He tries.', 'Él lo intenta.'],
     ['He tries.', 'Él prueba.'],
     ['Help Tom.', 'Ayuda a Tom.'],
     ['Help him.', 'Ayúdalo.'],
     ['Hi, guys.', 'Hola, ¿qué hay?'],
     ['Hi, guys.', 'Ey, chavales.'],
     ['Hi, guys.', '¿Qué pasa, troncos?'],
     ['Hi, guys.', 'Buenas.'],
     ['Hi, guys.', '¿Qué tal os va?'],
     ['Hi, guys.', 'Hola por aquí.'],
     ['How cute!', '¡Qué encanto!'],
     ['How deep?', '¿Qué tan profundo?'],
     ['How deep?', '¿Cómo de profundo?'],
     ['Humor me.', 'Hazme el favor.'],
     ['Humor me.', 'Compláceme.'],
     ['Hurry up.', '¡Date prisa!'],
     ['Hurry up.', 'Apresúrate.'],
     ['I agreed.', 'Convine.'],
     ['I agreed.', 'Acepté.'],
     ['I agreed.', 'Accedí.'],
     ['I am fat.', 'Soy gorda.'],
     ['I am old.', 'Estoy viejo.'],
     ['I ate it.', 'Me lo comí.'],
     ['I ate it.', 'Me la comí.'],
     ['I can go.', 'Puedo ir.'],
     ['I did OK.', 'Lo hice bien.'],
     ['I did it.', 'Lo hice.'],
     ['I failed.', 'Fracasé.'],
     ['I forgot.', 'Lo olvidé.'],
     ['I get by.', 'Me las arreglo.'],
     ['I get it.', 'Lo entiendo.'],
     ['I got it.', 'Lo tengo.'],
     ['I phoned.', 'Llamé por teléfono.'],
     ['I refuse.', 'Me niego.'],
     ['I resign.', 'Dimito.'],
     ['I resign.', 'Renuncio.'],
     ['I saw it.', 'Lo vi.'],
     ['I smiled.', 'Sonreí.'],
     ['I stayed.', 'Me quedé.'],
     ['I talked.', 'Hablé.'],
     ['I talked.', 'Hablaba.'],
     ['I talked.', 'Charlé.'],
     ['I talked.', 'Charlaba.'],
     ['I use it.', 'Yo lo uso.'],
     ['I waited.', 'Esperé.'],
     ["I'll pay.", 'Yo pagaré.'],
     ["I'm back.", 'He vuelto.'],
     ["I'm back.", 'Estoy de vuelta.'],
     ["I'm bald.", 'Soy calvo.'],
     ["I'm bald.", 'Estoy calvo.'],
     ["I'm calm.", 'Estoy calmado.'],
     ["I'm cool.", 'Estoy tranquilo.'],
     ["I'm done.", 'He terminado.'],
     ["I'm easy.", 'Soy bastante facilón.'],
     ["I'm fair.", 'Soy justo.'],
     ["I'm fine.", 'Estoy perfectamente.'],
     ["I'm free!", '¡Soy libre!'],
     ["I'm free.", 'Yo soy libre.'],
     ["I'm full.", 'Estoy lleno.'],
     ["I'm full.", 'Estoy llena.'],
     ["I'm full.", 'Ya me llené.'],
     ["I'm here.", 'Estoy aquí.'],
     ["I'm home.", 'Estoy en casa.'],
     ["I'm hurt.", 'Estoy herido.'],
     ["I'm late.", 'Llego tarde.'],
     ["I'm lazy.", 'Soy vago.'],
     ["I'm lost.", 'Estoy perdida.'],
     ["I'm mean.", 'Soy malo.'],
     ["I'm next.", 'Me toca a mí.'],
     ["I'm okay.", 'Estoy perfectamente.'],
     ["I'm poor.", 'Soy pobre.'],
     ["I'm rich.", 'Soy rica.'],
     ["I'm rich.", 'Soy rico.'],
     ["I'm safe.", 'Estoy a salvo.'],
     ["I'm sick.", 'Estoy enferma.'],
     ["I'm thin.", 'Soy delgado.'],
     ["I'm tidy.", 'Estoy limpio.'],
     ["I'm warm.", 'Estoy calentito.'],
     ["I'm weak.", 'Estoy débil.'],
     ["I'm wise.", 'Soy listo.'],
     ["I've won.", 'Gané.'],
     ['It helps.', 'Eso ayuda.'],
     ['It hurts.', 'Duele.'],
     ['It works.', 'Funciona.'],
     ["It's Tom.", 'Es Tom.'],
     ["It's fun.", 'Es divertido.'],
     ["It's his.", 'Es suyo.'],
     ["It's new.", 'Es nuevo.'],
     ["It's odd.", 'Es extraño.'],
     ["It's old.", 'Es viejo.'],
     ["It's red.", 'Es rojo.'],
     ["It's sad.", 'Es triste.'],
     ['Keep out!', 'Prohibido pasar.'],
     ['Keep out.', 'No entrar.'],
     ['Kiss Tom.', 'Besá a Tomás.'],
     ['Kiss Tom.', 'Besa a Tomás.'],
     ['Kiss Tom.', 'Besen a Tomás.'],
     ['Leave it.', 'Déjalo.'],
     ['Leave me.', 'Déjame.'],
     ['Leave us.', 'Déjanos.'],
     ["Let's go!", 'Vamos.'],
     ["Let's go!", '¡Órale!'],
     ['Look out!', 'Cuidado.'],
     ['Marry me.', 'Cásate conmigo.'],
     ['May I go?', '¿Puedo ir?'],
     ['Save Tom.', 'Salva a Tom.'],
     ['She came.', 'Ella vino.'],
     ['She died.', 'Ella murió.'],
     ['She runs.', 'Ella corre.'],
     ['Sit down!', '¡Sentate!'],
     ['Sit down.', 'Siéntate.'],
     ['Sit here.', 'Siéntate aquí.'],
     ['Speak up!', '¡Hable más fuerte!'],
     ['Speak up!', 'Habla más fuerte.'],
     ['Speak up!', '¡Habla más alto!'],
     ['Stand by.', 'Prepárate.'],
     ['Stand by.', 'Un momento.'],
     ['Stand up!', '¡Parate!'],
     ['Stand up!', '¡De pie!'],
     ['Stay put.', 'No te muevas.'],
     ['Stop Tom.', 'Detén a Tom.'],
     ['Take Tom.', 'Llévate a Tom.'],
     ['Tell Tom.', 'Díselo a Tom.'],
     ['Terrific!', '¡Genial!'],
     ['Terrific!', '¡Órale!'],
     ['They won.', 'Ellos ganaron.'],
     ['Tom came.', 'Tom vino.'],
     ['Tom died.', 'Tom ha muerto.'],
     ['Tom fell.', 'Tom se cayó.'],
     ['Tom knew.', 'Tom lo sabía.'],
     ['Tom knew.', 'Tom tenía constancia de ello.'],
     ['Tom left.', 'Tom se fue.'],
     ['Tom lied.', 'Tom mintió.'],
     ['Tom lies.', 'Tomás miente.'],
     ['Tom lost.', 'Tom perdió.'],
     ['Tom paid.', 'Tom pagó.'],
     ['Tom quit.', 'Tom renunció.'],
     ['Tom swam.', 'Tom nadó.'],
     ['Tom wept.', 'Tom lloró.'],
     ["Tom's up.", 'Tom se ha levantado.'],
     ['Too late.', 'Demasiado tarde.'],
     ['Trust me.', 'Confía en mí.'],
     ['Try hard.', 'Inténtalo de veras.'],
     ['Try some.', 'Prueba un poco.'],
     ['Try some.', 'Pruebe un poco.'],
     ['Try some.', 'Prueben un poco.'],
     ['Try this.', 'Prueben esto.'],
     ['Try this.', 'Probá esto.'],
     ['Try this.', 'Prueba esto.'],
     ['Use this.', 'Usa esto.'],
     ['Warn Tom.', 'Avísale a Tom.'],
     ['Warn Tom.', 'Avísele a Tom.'],
     ['Warn Tom.', 'Avísenle a Tom.'],
     ['Warn Tom.', 'Avisale a Tom.'],
     ['Watch me.', 'Mírame.'],
     ['Watch me.', 'Vigílame.'],
     ['Watch me.', 'Obsérvame.'],
     ['Watch us.', 'Obsérvalos.'],
     ['Watch us.', 'Obsérvanos.'],
     ['We agree.', 'Estamos de acuerdo.'],
     ['We tried.', 'Lo intentamos.'],
     ["We'll go.", 'Iremos.'],
     ["We're OK.", 'Estamos bien.'],
     ['What for?', '¿Para qué?'],
     ['What fun!', '¡Qué divertido!'],
     ['Who am I?', '¿Quién soy yo?'],
     ['Who came?', '¿Quién vino?'],
     ['Who died?', '¿Quién murió?'],
     ['Who fell?', '¿Quién se calló?'],
     ['Who fell?', '¿Quién se cayó?'],
     ['Who quit?', '¿Quién se ha ido?'],
     ['Who quit?', '¿Quién lo ha dejado?'],
     ['Who swam?', '¿Quién nadó?'],
     ["Who's he?", '¿Quién es él?'],
     ['Write me.', 'Escríbeme.'],
     ['After you.', 'Después de ti.'],
     ['After you.', 'Tú primero.'],
     ['After you.', 'Usted primero.'],
     ['After you.', 'Después de usted.'],
     ['After you.', 'Después de vosotras.'],
     ['Aim. Fire!', 'Apunta. ¡Fuego!'],
     ['Answer me.', 'Respóndeme.'],
     ['Answer me.', 'Respondedme.'],
     ['Answer me.', 'Respóndanme.'],
     ['Birds fly.', 'Los pájaros vuelan.'],
     ['Bless you.', 'Jesús.'],
     ['Call home!', '¡Llama a casa!'],
     ['Calm down.', 'Cálmate.'],
     ['Calm down.', 'Tranquilízate.'],
     ['Calm down.', 'Tomátelo con soda.'],
     ['Calm down.', 'Bajá un cambio.'],
     ['Can we go?', '¿Podemos ir?'],
     ['Can we go?', '¿Podemos irnos?'],
     ['Can we go?', '¿Podemos marcharnos?'],
     ['Catch Tom.', '¡Atrápelo a Tomás!'],
     ['Catch him.', 'Captúralo.'],
     ['Catch him.', 'Captúrenlo.'],
     ['Catch him.', 'Atrápenlo.'],
     ['Catch him.', 'Atrápalo.'],
     ['Come back.', 'Vuelve.'],
     ['Come here.', 'Vení.'],
     ['Come here.', 'Ven.'],
     ['Come here.', 'Venid aquí.'],
     ['Come home.', 'Ven a casa.'],
     ['Come over.', 'Venid aquí.'],
     ['Come over.', 'Vente.'],
     ['Come over.', 'Veníos.'],
     ['Come over.', 'Venga aquí.'],
     ['Come soon.', 'Vuelve pronto.'],
     ['Do it now.', 'Hazlo ahora.'],
     ['Dogs bark.', 'Los perros ladran.'],
     ["Don't ask.", 'No preguntes.'],
     ["Don't cry.", 'No llores.'],
     ["Don't cry.", '¡No llorés!'],
     ["Don't cry.", '¡No llores!'],
     ["Don't cry.", 'No lloren.'],
     ["Don't lie.", 'No mintáis.'],
     ["Don't run.", 'No corras.'],
     ['Fantastic!', '¡Fantástico!'],
     ['Fantastic!', '¡Es estupendo!'],
     ['Fantastic!', '¡Órale!'],
     ['Feel this.', 'Tienta esto.'],
     ['Feel this.', 'Tiente esto.'],
     ['Feel this.', 'Tienten esto.'],
     ['Feel this.', 'Tentad esto.'],
     ['Feel this.', 'Tentá esto.'],
     ['Follow me.', 'Sígueme.'],
     ['Follow me.', 'Seguidme.'],
     ['Follow us.', 'Síguenos.'],
     ['Forget it.', 'Déjalo.'],
     ['Forget me.', 'Olvídame.'],
     ['Forget me.', 'Olvídate de mí.'],
     ['Forget me.', 'Olvídenme.'],
     ['Forget me.', 'Olvídense de mí.'],
     ['Get ready.', 'Preparaos.'],
     ['Go for it.', 'Ve a por ello.'],
     ['Go for it.', 'Ve a cogerlo.'],
     ['Go get it.', 'Ve a por ello.'],
     ['Go get it.', 'Vete a por ello.'],
     ['Go get it.', 'Id a por ello.'],
     ['Go inside.', 'Entra.'],
     ['Go to bed.', 'Vete a la cama.'],
     ['Grab that.', 'Cógelo.'],
     ['Grab this.', 'Agarra esto.'],
     ['Have some.', 'Coge alguno.'],
     ['Have some.', 'Toma algo.'],
     ['Have some.', 'Tome alguno.'],
     ['He is old.', 'Él es viejo.'],
     ['He is old.', 'Él es anciano.'],
     ['He shaved.', 'Él se afeitó.'],
     ['He smiled.', 'Sonrió.'],
     ["He's a DJ.", 'Él es DJ.'],
     ["He's fast.", 'Él es veloz.'],
     ["He's good.", 'Él es bueno.'],
     ["He's rich.", 'Él es rico.'],
     ["He's rich.", 'Es rico.'],
     ['Here I am.', 'Acá estoy.'],
     ['Hold this.', 'Sostén esto.'],
     ['How awful!', '¡Qué horror!'],
     ['How weird!', '¡Qué raro!'],
     ["How's Tom?", '¿Cómo está Tom?'],
     ['Humor Tom.', 'Divierte a Tom.'],
     ['I am busy.', 'Estoy ocupada.'],
     ['I am full.', 'Estoy lleno.'],
     ['I am full.', 'Estoy llena.'],
     ['I am good.', 'Soy bueno.'],
     ['I am here.', 'Estoy aquí.'],
     ['I am sick.', 'Estoy enferma.'],
     ['I am weak.', 'Estoy débil.'],
     ['I beg you.', 'Te lo ruego.'],
     ['I beg you.', 'Te lo suplico.'],
     ['I can fly.', 'Puedo volar.'],
     ['I can run.', 'Puedo correr.'],
     ['I can run.', 'Sé correr.'],
     ['I can ski.', 'Sé esquiar.'],
     ['I cringed.', 'Sentí vergüenza.'],
     ['I fainted.', 'Perdí la consciencia.'],
     ['I fainted.', 'Quedé inconsciente.'],
     ['I gave up.', 'Lo dejé.'],
     ['I gave up.', 'Me rendí.'],
     ['I gave up.', 'Tiré la toalla.'],
     ['I gave up.', 'Cedí.'],
     ['I get you.', 'Te entiendo.'],
     ['I get you.', 'Te pillo.'],
     ['I get you.', 'Ya te pillo.'],
     ['I got hit.', 'Me dieron.'],
     ['I got hit.', 'Me alcanzaron.'],
     ['I hate it.', 'Lo odio.'],
     ['I hate it.', 'Me la seca.'],
     ['I hate it.', 'Me la baja.'],
     ['I hit Tom.', 'Golpeo a Tom.'],
     ['I hope so.', 'Eso espero.'],
     ['I knew it.', 'Lo sabía.'],
     ['I laughed.', 'Me reí.'],
     ['I like it.', 'Me gusta.'],
     ['I love it!', '¡Lo adoro!'],
     ['I love it.', 'Me encanta.'],
     ['I mean it!', 'Hablo en serio.'],
     ['I mean it.', 'Lo digo en serio.'],
     ['I mean it.', 'Hablo en serio.'],
     ['I miss it.', 'Lo echo en falta.'],
     ['I miss it.', 'Lo echo de menos.'],
     ['I miss it.', 'Lo añoro.'],
     ['I need it.', 'Lo necesito.'],
     ['I saw Tom.', 'Vi a Tom.'],
     ['I saw him.', 'Le vi.'],
     ['I saw him.', 'Lo vi.'],
     ['I saw one.', 'Vi uno.'],
     ['I saw one.', 'Vi a uno.'],
     ['I saw one.', 'Veía a uno.'],
     ['I saw you.', 'Te vi.'],
     ['I saw you.', 'Te he visto.'],
     ['I see Tom.', 'Veo a Tom.'],
     ['I tripped.', 'Me tropecé.'],
     ["I'll cook.", 'Yo cocinaré.'],
     ["I'll cook.", 'Yo guisaré.'],
     ["I'll live.", 'Viviré.'],
     ["I'll sing.", 'Cantaré.'],
     ["I'll stop.", 'Pararé.'],
     ["I'll stop.", 'Lo dejaré.'],
     ["I'll wait.", 'Esperaré.'],
     ["I'll wait.", 'Aguardaré.'],
     ["I'll walk.", 'Caminaré.'],
     ["I'll walk.", 'Andaré.'],
     ["I'll work.", 'Voy a trabajar.'],
     ["I'm a man.", 'Soy un hombre.'],
     ["I'm a pro.", 'Soy un pro.'],
     ["I'm alone.", 'Estoy solo.'],
     ["I'm alone.", 'Estoy sola.'],
     ["I'm alone.", 'Yo estoy solo.'],
     ["I'm alone.", 'Yo estoy sola.'],
     ["I'm angry.", 'Estoy enojado.'],
     ["I'm angry.", 'Estoy enojada.'],
     ["I'm awake.", 'Estoy despierto.'],
     ["I'm blind.", 'Soy ciega.'],
     ["I'm broke.", 'Estoy sin dinero.'],
     ["I'm broke.", 'Estoy quebrado.'],
     ["I'm broke.", 'Estoy sin blanca.'],
     ["I'm broke.", 'No tengo blanca.'],
     ["I'm crazy.", 'Estoy loco.'],
     ["I'm drunk.", 'Estoy borracho.'],
     ["I'm drunk.", 'Estoy tomada.'],
     ["I'm drunk.", 'Estoy prendida.'],
     ["I'm dying.", 'Me estoy muriendo.'],
     ["I'm first.", 'Soy el primero.'],
     ["I'm first.", 'Voy el primero.'],
     ["I'm first.", 'Me toca primero.'],
     ["I'm first.", 'Yo voy primero.'],
     ["I'm happy.", 'Soy feliz.'],
     ["I'm happy.", 'Estoy feliz.'],
     ["I'm loved.", 'Soy amado.'],
     ["I'm loved.", 'Soy amada.'],
     ["I'm obese.", 'Soy obeso.'],
     ["I'm ready.", 'Estoy listo.'],
     ["I'm sorry.", 'Lo siento.'],
     ["I'm tired.", 'Yo estoy cansado.'],
     ["I'm tired.", 'Yo estoy cansada.'],
     ["I'm yours.", 'Soy tuyo.'],
     ["I'm yours.", 'Soy tuya.'],
     ["I'm yours.", 'Soy suyo.'],
     ["I've lost.", 'He perdido.'],
     ['Ignore it.', 'Ólvidalo.'],
     ['Ignore it.', 'No hagas caso.'],
     ['Is Tom OK?', '¿Está bien Tom?'],
     ['Is Tom in?', '¿Está Tom?'],
     ['Is it bad?', '¿Es grave?'],
     ['Is it bad?', '¿Es malo?'],
     ['Is it far?', '¿Está lejos?'],
     ['Is it you?', '¿Eres tú?'],
     ['It burned.', 'Se quemó.'],
     ['It failed.', 'No lo consiguió.'],
     ['It failed.', 'Falló.'],
     ['It failed.', 'Fracasó.'],
     ['It is new.', 'Es nuevo.'],
     ['It rained.', 'Llovió.'],
     ['It snowed.', 'Nevó.'],
     ['It stinks.', 'Apesta.'],
     ['It worked.', 'Funcionó.'],
     ["It's 3:10.", 'Son las tres y diez.'],
     ["It's 8:30.", 'Son las 8:30.'],
     ["It's a TV.", 'Es un televisor.'],
     ["It's cold.", 'Hace frío.'],
     ["It's cold.", 'Está frío.'],
     ["It's cool.", 'Está frío.'],
     ["It's cool.", 'Está fresco.'],
     ["It's dark.", 'Está oscuro.'],
     ["It's done!", '¡Está listo!'],
     ["It's fine.", 'Está perfecto.'],
     ["It's good.", 'Está bien.'],
     ["It's good.", 'Es bueno.'],
     ["It's here.", 'Está aquí.'],
     ["It's hers.", 'Es de ella.'],
     ["It's late.", 'Es tarde.'],
     ["It's mine.", 'Es mío.'],
     ["It's mine.", 'Es mía.'],
     ["It's nice.", 'Es agradable.'],
     ["It's nice.", 'Hace buen tiempo.'],
     ["It's okay.", 'Vale.'],
     ["It's okay.", 'Está bien.'],
     ["It's ours.", 'Es nuestro.'],
     ["It's ours.", 'Es la nuestra.'],
     ["It's over.", 'Se terminó.'],
     ["It's over.", 'Se acabó.'],
     ["It's time.", 'Ha llegado el momento.'],
     ["It's time.", 'Es la hora.'],
     ["It's time.", 'Es el momento.'],
     ["It's time.", 'Ha llegado la hora.'],
     ["It's true!", '¡Es verdad!'],
     ["It's true.", 'Es verdad.'],
     ["It's work.", 'Es mi trabajo.'],
     ['Keep them.', 'Guárdalos.'],
     ['Keep them.', 'Quédatelos.'],
     ['Keep them.', 'Guárdenselos.'],
     ['Keep this.', 'Guarda esto.'],
     ['Keep this.', 'Guarde esto.'],
     ['Keep this.', 'Guardá esto.'],
     ['Keep this.', 'Guardad esto.'],
     ['Keep this.', 'Guarden esto.'],
     ['Keep warm.', 'Mantente caliente.'],
     ['Keep warm.', 'Manténgase caliente.'],
     ['Keep warm.', 'Mantenete caliente.'],
     ['Keep warm.', 'Mantenete abrigado.'],
     ['Keep warm.', 'Mantente abrigado.'],
     ['Keep warm.', 'Manténgase abrigado.'],
     ['Keep warm.', 'Manténganse calientes.'],
     ['Keep warm.', 'Manténganse abrigados.'],
     ['Leave Tom.', 'Dejalo a Tomás.'],
     ['Leave Tom.', 'Déjalo a Tomás.'],
     ['Leave Tom.', 'Déjelo a Tomás.'],
     ['Leave now.', 'Ahora márchate.'],
     ['Leave now.', 'Ahora vete.'],
     ['Leave now.', 'Ahora lárgate.'],
     ['Let me go!', '¡Déjame marchar!'],
     ['Let me go!', '¡Suéltame!'],
     ['Let me go!', '¡Déjeme ir!'],
     ['Let me go.', '¡Déjeme ir!'],
     ['Let me in.', 'Déjame entrar.'],
     ['Let me in.', 'Déjeme entrar.'],
     ['Let us in.', 'Déjanos entrar.'],
     ["Let's eat.", 'Comamos.'],
     ["Let's see.", 'Veamos.'],
     ["Let's try!", '¡Intentémoslo!'],
     ['Lie still.', 'Túmbate en silencio.'],
     ['Lie still.', 'Mantente quieto en el suelo.'],
     ['Listen up.', 'Escuchá.'],
     ['Look away.', 'Mirá para otro lado.'],
     ['Look away.', 'Mira para otro lado.'],
     ['Look away.', 'Mire para otro lado.'],
     ['Look away.', 'Miren para otro lado.'],
     ['Look back!', '¡Mira hacia atrás!'],
     ['Look back.', 'Mira atrás.'],
     ['Look back.', 'Mire atrás.'],
     ['Look back.', 'Mirad atrás.'],
     ['Look here.', 'Mira aquí.'],
     ['Look here.', 'Mirad aquí.'],
     ['Look here.', 'Miren aquí.'],
     ['Loosen it.', 'Aflójalo.'],
     ['Loosen it.', 'Suéltalo.'],
     ['Loosen it.', 'Suéltala.'],
     ['Loosen it.', 'Aflójala.'],
     ['Move over.', 'Hazte a un lado.'],
     ['Move over.', 'Deja sitio.'],
     ['Move over.', 'Mueve el culo.'],
     ['Move over.', 'Deja pasar.'],
     ['Nice shot!', '¡Buen tiro!'],
     ['Of course!', '¡Por supuesto!'],
     ['Open fire!', '¡Disparad!'],
     ['Open fire!', '¡Fuego a discreción!'],
     ['Pardon me?', '¿Perdona?'],
     ['Please go.', 'Por favor, ve.'],
     ['Please go.', 'Por favor, vete.'],
     ['Please go.', 'Por favor, márchate.'],
     ['Please go.', 'Por favor, váyase.'],
     ['Put it on.', 'Póntelo.'],
     ['Put it on.', 'Póngaselo.'],
     ['Read this.', 'Lee esto.'],
     ['Read this.', 'Lea esto.'],
     ['Read this.', 'Lean esto.'],
     ['Read this.', 'Leed esto.'],
     ['Say hello.', 'Decí hola.'],
     ['Search me.', 'A mí que me registren.'],
     ['See above.', 'Véase arriba.'],
     ['See above.', 'Véase más arriba.'],
     ['Seize him!', '¡A por él!'],
     ['Seize him!', '¡Cogedlo!'],
     ['Seize him!', '¡Arrestadlo!'],
     ['Seize him!', '¡Prendedlo!'],
     ['Seize him!', '¡Capturadlo!'],
     ['Seriously?', '¿En serio?'],
     ['She tried.', 'Ella lo intentó.'],
     ['She tried.', 'Ella lo probó.'],
     ['She walks.', 'Ella anda.'],
     ['She walks.', 'Ella camina.'],
     ['She walks.', 'Anda.'],
     ["She's hot.", 'Ella es candente.'],
     ["She's hot.", 'Está como un tren.'],
     ["She's hot.", 'Está de toma pan y moja.'],
     ["She's hot.", 'Está buena.'],
     ["She's hot.", 'Está que cruje.'],
     ['Sign here.', 'Firme aquí.'],
     ['Sign this.', 'Firma esto.'],
     ['Sign this.', 'Firme esto.'],
     ['Sign this.', 'Firmen esto.'],
     ['Sign this.', 'Firmá esto.'],
     ['Sign this.', 'Firmad esto.'],
     ['Sit still.', 'Siéntate y no te muevas.'],
     ['Sit still.', 'Siéntate y quédate quieto.'],
     ['Sit there.', 'Sentate ahí.'],
     ['Sit tight.', 'Tú mantente.'],
     ['Slow down.', 'Quieto.'],
     ['Slow down.', 'Más despacio.'],
     ['Stay away.', 'Fuera.'],
     ['Stay away.', 'Aléjate.'],
     ['Stay calm.', 'Mantén la calma.'],
     ['Stay calm.', 'Mantené la calma.'],
     ['Stay here.', 'Quedate acá.'],
     ['Step back.', 'Da un paso atrás.'],
     ['Stop here.', 'Para aquí.'],
     ['Stop here.', 'Párate aquí.'],
     ['Stop here.', 'Detente aquí.'],
     ['Stop here.', 'Deténgase aquí.'],
     ['Stop here.', 'Deténganse aquí.'],
     ['Stop here.', 'Paraos aquí.'],
     ['Stop here.', 'Parad aquí.'],
     ['Stop that.', 'Para eso.'],
     ['Stop them.', 'Deténlos.'],
     ['Stop them.', 'Párales.'],
     ['Take care!', '¡Cuidate!'],
     ['Take care!', '¡Te cuidas!'],
     ['Take care.', 'Cuídate.'],
     ['Take care.', 'Cuidaos.'],
     ['Take mine.', 'Coge el mío.'],
     ['Take mine.', 'Toma el mío.'],
     ['Take over.', 'Asume el mando.'],
     ['Take over.', 'Toma el control.'],
     ['Take over.', 'Encárgate tú.'],
     ['Take this.', 'Toma esto.'],
     ['Take this.', 'Tome esto.'],
     ['Take this.', 'Tomen esto.'],
     ['Take this.', 'Tomá esto.'],
     ['Thank you.', '¡Gracias!'],
     ['Thank you.', 'Gracias a ti.'],
     ['Thank you.', 'Gracias.'],
     ["That's it.", 'Eso es.'],
     ["That's me.", 'Soy yo.'],
     ["That's me.", 'Ese soy yo.'],
     ['Then what?', '¿Entonces qué?'],
     ['They fell.', 'Cayeron.'],
     ['They left.', 'Se fueron.'],
     ['They left.', 'Se marcharon.'],
     ['They left.', 'Se iban.'],
     ['They lost.', 'Perdieron.'],
     ['Tom bowed.', 'Tom se inclinó.'],
     ['Tom cared.', 'Tom se preocupó.'],
     ['Tom cared.', 'Tom se preocupaba.'],
     ['Tom cared.', 'A Tom le importaba.'],
     ['Tom cares.', 'Tom se preocupa.'],
     ['Tom cares.', 'A Tom le importa.'],
     ['Tom cried.', 'Tom lloró.'],
     ['Tom dozed.', 'Tom dormitó.'],
     ['Tom drove.', 'Tomás condujo.'],
     ['Tom is OK.', 'Tom está bien.'],
     ['Tom is in.', 'Tom está dentro.'],
     ['Tom is up.', 'Tom está levantado.'],
     ['Tom knits.', 'Tom teje.'],
     ['Tom knows.', 'Tom sabe.'],
     ['Tom moved.', 'Tom se mudó.'],
     ['Tom moved.', 'Tom se movió.'],
     ['Tom rocks.', 'Tom se mece.'],
     ['Tom stood.', 'Tom se quedó.'],
     ['Tom swims.', 'Tom nada.'],
     ['Tom swore.', 'Tom juró.'],
     ['Tom tried.', 'Tomás lo intentó.'],
     ['Tom tries.', 'Tomás lo intenta.'],
     ['Tom voted.', 'Tomás votó.'],
     ['Tom walks.', 'Tom camina.'],
     ['Tom waved.', 'Tom saludó.'],
     ['Tom works.', 'Tomás trabaja.'],
     ["Tom'll go.", 'Tom irá.'],
     ["Tom's fat.", 'Tom está gordo.'],
     ["Tom's mad.", 'Tom está loco.'],
     ["Tom's sad.", 'Tom está triste.'],
     ["Tom's shy.", 'Tom es tímido.'],
     ['Trust Tom.', 'Confía en Tom.'],
     ['Try again.', 'Inténtalo de nuevo.'],
     ['Try again.', 'Intentadlo otra vez.'],
     ['Try again.', 'Intenta otra vez.'],
     ['Try it on.', 'Pruébatelo.'],
     ['Wait here.', 'Espera aquí.'],
     ['Wait here.', 'Aguarda aquí.'],
     ['Wait here.', 'Esperen aquí.'],
     ['Wait here.', 'Esperad aquí.'],
     ['Watch Tom.', 'Vigila a Tom.'],
     ['Watch out!', '¡Abusado!'],
     ['We can go.', 'Podemos ir.'],
     ['We can go.', 'Podemos irnos.'],
     ['We can go.', 'Nos podemos marchar.'],
     ['We failed.', 'Fallamos.'],
     ['We failed.', 'Hemos fallado.'],
     ['We forgot.', 'Nos olvidamos.'],
     ['We saw it.', 'Lo vimos.'],
     ['We saw it.', 'Lo veíamos.'],
     ['We talked.', 'Conversamos.'],
     ['We waited.', 'Nosotros esperamos.'],
     ["We'll see.", 'Después veremos.'],
     ["We'll see.", 'Ya veremos.'],
     ["We'll try.", 'Lo intentaremos.'],
     ["We've won!", '¡Hemos ganado!'],
     ["What's up?", '¿Qué hay?'],
     ['Who cares?', '¿A quién le importa?'],
     ['Who is he?', '¿Quién es él?'],
     ['Who is it?', '¿Quién es?'],
     ['Who knows?', 'Aabe...'],
     ['Who stood?', '¿Quién se quedó?'],
     ["Who'll go?", '¿Quién irá?'],
     ["Who's Tom?", '¿Quién es Tom?'],
     ['Write Tom.', 'Escribe a Tom.'],
     ['You drive.', 'Tú maneja.'],
     ['You start.', 'Tú empieza.'],
     ['You tried.', 'Lo intentaste.'],
     ["You're OK.", 'Tú estás perfectamente.'],
     ["You're OK.", 'Estás perfectamente.'],
     ['Aim higher.', 'Más alto.'],
     ['Aim higher.', 'Apuntad más alto.'],
     ['All aboard!', '¡Todos a bordo!'],
     ['Am I right?', '¿Tengo razón?'],
     ['Am I wrong?', '¿Me equivoco?'],
     ['Am I wrong?', '¿Estoy equivocada?'],
     ['Answer Tom.', '¡Respóndale a Tomás!'],
     ['Answer Tom.', '¡Respondele a Tomás!'],
     ['Answer Tom.', '¡Respóndanle a Tomás!'],
     ['Are you 18?', '¿Tienes dieciocho?'],
     ['Are you 18?', '¿Has cumplido dieciocho?'],
     ['Are you OK?', '¿Estás bien?'],
     ['Are you in?', '¿Te apuntas?'],
     ['Are you in?', '¿Estás dentro?'],
     ['Are you up?', '¿Estás levantado?'],
     ['Ask anyone.', 'Pregúntale a cualquiera.'],
     ['Ask anyone.', 'Preguntadle a cualquiera.'],
     ['Ask anyone.', 'Pregúntele a cualquiera.'],
     ['Ask anyone.', 'Pregúntenle a cualquiera.'],
     ['Ask around.', 'Pregunta por aquí.'],
     ['Ask around.', 'Pregunta en los alrededores.'],
     ['Be careful.', '¡Ten cuidado!'],
     ['Be careful.', '¡Sé cuidadoso!'],
     ['Be content.', 'Estate contento.'],
     ['Be on time.', 'Llega a tiempo.'],
     ['Be on time.', 'Llegue a tiempo.'],
     ['Be patient.', 'Sea paciente.'],
     ['Be serious.', 'Sé serio.'],
     ['Birds sing.', 'Los pájaros cantan.'],
     ['Birds sing.', 'Los pájaros están cantando.'],
     ['Bring food.', 'Traed comida.'],
     ['Bring help.', 'Traed ayuda.'],
     ['Bring wine.', 'Trae vino.'],
     ['Can I come?', '¿Puedo ir?'],
     ['Can I come?', '¿Puedo venir?'],
     ['Can I come?', '¿Puedo acercarme?'],
     ['Can I help?', '¿Puedo ayudar?'],
     ['Can I stay?', '¿Me puedo quedar?'],
     ['Carry this.', 'Lleva esto.'],
     ['Check that.', 'Comprobad eso.'],
     ['Check this.', 'Comprueba esto.'],
     ['Choose one.', 'Escoge uno.'],
     ['Come again.', 'Vuelve otra vez.'],
     ['Come alone.', 'Ven solo.'],
     ['Come along.', 'Vente.'],
     ['Come along.', 'Vénganse.'],
     ['Come early.', 'Vení temprano.'],
     ['Come early.', 'Ven temprano.'],
     ['Come early.', 'Vengan temprano.'],
     ['Come early.', 'Venga temprano.'],
     ['Come on in!', '¡Pásale!'],
     ['Come on in!', '¡Pásele!'],
     ['Come on in!', '¡Pásenle!'],
     ['Come on in.', 'Entre.'],
     ['Come on in.', 'Pase.'],
     ['Come quick!', '¡Ven rápido!'],
     ['Come quick!', '¡Vení rápido!'],
     ['Come to me.', 'Ven a mí.'],
     ['Come to me.', 'Venid a mí.'],
     ['Come to us.', 'Ven a nosotros.'],
     ['Come to us.', 'Venid a nosotros.'],
     ['Cut it out!', '¡Ya párale!'],
     ['Did Tom go?', '¿Fue Tom?'],
     ['Do come in!', '¡Pásale!'],
     ['Do come in!', '¡Pásele!'],
     ['Do come in!', '¡Pásenle!'],
     ['Do come in.', 'Pasa adentro.'],
     ['Do come in.', 'Entra de una vez.'],
     ['Do come in.', 'Entra ya.'],
     ['Do come in.', 'Métete dentro.'],
     ['Do men cry?', '¿Los hombres lloran?'],
     ["Don't come.", 'No vengas.'],
     ["Don't jump!", '¡No saltéis!'],
     ["Don't look.", 'No miréis.'],
     ["Don't move!", '¡No os mováis!'],
     ["Don't move.", 'No te muevas.'],
     ["Don't move.", 'No se mueva.'],
     ["Don't move.", 'No se muevan.'],
     ["Don't sing.", 'No cantes.'],
     ["Don't sing.", 'No canten.'],
     ["Don't stop.", 'No pares.'],
     ["Don't talk!", '¡No hables!'],
     ["Don't talk.", 'No hables.'],
     ["Don't wait.", '¡No esperes!'],
     ["Don't wait.", '¡No esperen!'],
     ["Don't wait.", 'No esperes.'],
     ["Don't yell.", 'No grites.'],
     ['Eat slowly.', 'Come despacio.'],
     ['Eat slowly.', '¡Comé despacio!'],
     ['Fire burns.', 'El fuego quema.'],
     ['Follow Tom.', 'Seguilo a Tomás.'],
     ['Follow Tom.', 'Síguelo a Tomás.'],
     ['Follow Tom.', 'Sígalo a Tomás.'],
     ['Follow Tom.', 'Síganlo a Tomás.'],
     ['Follow him.', 'Síguele.'],
     ['Follow him.', 'Síguelo.'],
     ['Forget Tom.', 'Olvidate de Tomás.'],
     ['Forget Tom.', 'Olvídate de Tomás.'],
     ['Forget Tom.', 'Olvídese de Tomás.'],
     ['Forget him.', 'Olvídenlo.'],
     ['Forgive us.', 'Perdónanos.'],
     ['Forgive us.', 'Perdónenos.'],
     ['Get a life.', 'Consíguete una vida.'],
     ['Get inside.', 'Entra.'],
     ['Get to bed.', 'Vete a la cama.'],
     ['Give it up.', 'Déjalo.'],
     ['Go on home.', 'Vete a casa.'],
     ['Go on home.', 'Váyase a casa.'],
     ['Go see Tom.', 'Ve a ver a Tom.'],
     ['Go to work.', 'Andá a trabajar.'],
     ['God exists.', 'Dios existe.'],
     ['Have faith.', 'Ten fe.'],
     ['Have faith.', 'Tened fe.'],
     ['Have faith.', 'Tengan fe.'],
     ['Have faith.', 'Confíen.'],
     ['He ate out.', 'Él salió a comer.'],
     ['He coughed.', 'Tosió.'],
     ['He gave in.', 'Él se rindió.'],
     ['He gave up.', 'Se rindió.'],
     ['He gave up.', 'Lo dejó.'],
     ['He gave up.', 'Cedió.'],
     ['He gave up.', 'Tiró la toalla.'],
     ['He hung up.', 'Descolgó.'],
     ['He hung up.', 'Él cogió el teléfono.'],
     ...]




```python
# MODIFICADO PARA AMBOS IDIOMAS

ds = []
ds2 = []

for p in pairs:
  # print(p)
  s = 'spanish sentence = ' + p[1] + ' english sentence = ' + p[0] + ' [END]'
  s2 = 'english sentence = ' + p[0] + ' spanish sentence = ' + p[1] + ' [END]'
  ds.append(s)
  ds.append(s2)

```


```python
# ds = load_data(path_to_file)
# print(ds[-1])
```

## 2.- Pipeline


```python
BUFFER_SIZE = len(ds)
batch_size = 128

text_ds = tf.data.Dataset.from_tensor_slices(ds).shuffle(BUFFER_SIZE)
text_ds = text_ds.shuffle(BUFFER_SIZE).batch(batch_size)

```


```python
vocab_size = 30000  
maxlen = 32
```


```python
vectorize_layer = TextVectorization(
    standardize=None,
    max_tokens=vocab_size - 1,
    output_mode="int",
    output_sequence_length=maxlen + 1,
)

vectorize_layer.adapt(text_ds)
vocab = vectorize_layer.get_vocabulary() 


def preprocess(text):
    text = tf.expand_dims(text, -1)
    tokenized_sentences = vectorize_layer(text)
    x = tokenized_sentences[:, :-1]
    y = tokenized_sentences[:, 1:]
    return x, y

text_ds = text_ds.map(preprocess)
text_ds = text_ds.prefetch(tf.data.AUTOTUNE)
```


```python
test_batch_x, test_batch_y = next(iter(text_ds))
test_batch_x
```




    <tf.Tensor: shape=(128, 32), dtype=int64, numpy=
    array([[5, 2, 3, ..., 0, 0, 0],
           [4, 2, 3, ..., 0, 0, 0],
           [4, 2, 3, ..., 0, 0, 0],
           ...,
           [4, 2, 3, ..., 0, 0, 0],
           [4, 2, 3, ..., 0, 0, 0],
           [5, 2, 3, ..., 0, 0, 0]])>



## 3.- Model

![[Pasted image 20241120212923.png]]

### Dot-product attention


```python
class MultiHeadAttention(layers.Layer):
    def __init__(self, model_dim, n_heads, rate=0.1, initializer='glorot_uniform'):
        super(MultiHeadAttention, self).__init__()
        self.n_heads = n_heads
        self.model_dim = model_dim

        assert model_dim % self.n_heads == 0

        self.head_dim = model_dim // self.n_heads

        self.wq = layers.Dense(model_dim, kernel_initializer=initializer)
        self.wk = layers.Dense(model_dim, kernel_initializer=initializer)
        self.wv = layers.Dense(model_dim, kernel_initializer=initializer)
        
        self.dropout1 = layers.Dropout(rate)
        self.dropout2 = layers.Dropout(rate)
        
        self.wo = layers.Dense(model_dim, kernel_initializer=initializer)

    def split_heads(self, x, batch_size):
        x = tf.reshape(x, (batch_size, -1, self.n_heads, self.head_dim))
        return tf.transpose(x, perm=[0, 2, 1, 3])

    def call(self, q, k, v, mask=None):
        batch_size = tf.shape(q)[0]

        q = self.wq(q)  
        k = self.wk(k)  
        v = self.wv(v)  

        q = self.split_heads(q, batch_size) 
        k = self.split_heads(k, batch_size)  
        v = self.split_heads(v, batch_size) 

        dh = tf.cast(self.head_dim, tf.float32)
        qk = tf.matmul(q, k, transpose_b=True)
        scaled_qk =  qk / tf.math.sqrt(dh)
        
        if mask is not None:
            scaled_qk += (mask * -1e9) 

        attn = self.dropout1(tf.nn.softmax(scaled_qk, axis=-1))
        attn = tf.matmul(attn, v) 

        attn = tf.transpose(attn, perm=[0, 2, 1, 3]) 
        original_size_attention = tf.reshape(attn, (batch_size, -1, self.model_dim)) 

        output = self.dropout2(self.wo(original_size_attention))
        return output
```

### Transformer block


```python
class TransformerBlock(layers.Layer):
    def __init__(self, emb_dim, n_heads=4, mlp_dim=512, 
                 rate=0.1, initializer='glorot_uniform', eps=1e-6, activation='gelu'):
        super(TransformerBlock, self).__init__()
        self.attn = MultiHeadAttention(emb_dim, n_heads, initializer=initializer)
        self.mlp = tf.keras.Sequential([
            layers.Dense(mlp_dim, activation=activation, kernel_initializer=initializer), 
            layers.Dense(emb_dim, kernel_initializer=initializer),
            layers.Dropout(rate)
        ])
        self.ln1 = layers.LayerNormalization(epsilon=eps)
        self.ln2 = layers.LayerNormalization(epsilon=eps)

    def call(self, inputs, mask=None):
        x = self.ln1(inputs)
        x = inputs + self.attn(x, x, x, mask) 
        x = x + self.mlp(self.ln2(x))
        return x
    
    
emb_dim = 128
test_layer = TransformerBlock(emb_dim)
test_layer(tf.ones([1, maxlen, emb_dim])).shape
```




    TensorShape([1, 32, 128])



### Positional embedding


```python
class TokenEmbedding(layers.Layer):
    def __init__(self, maxlen, vocab_size, emb_dim, 
                 rate=0.1, initializer='glorot_uniform'):
        super(TokenEmbedding, self).__init__()
        self.max_len = maxlen
        self.token_emb = layers.Embedding(
            input_dim=vocab_size, output_dim=emb_dim, 
            embeddings_initializer=initializer)
        self.position_emb = layers.Embedding(
            input_dim=maxlen, output_dim=emb_dim, 
            embeddings_initializer=initializer)
        self.dropout = layers.Dropout(rate)

    def call(self, x):
        token_embeddings = self.token_emb(x)
        positions = tf.range(start=0, limit=self.max_len, delta=1)
        positions = self.position_emb(positions)
        return self.dropout(token_embeddings + positions) 
```

### GPT


```python
class GPT(tf.keras.models.Model):
    def __init__(self, vocab_size=20000, maxlen=512, 
                 emb_dim=256, heads=4, mlp_dim=128, depth=3, 
                 rate=0.2, initializer='glorot_uniform', 
                 embedding_initializer='glorot_uniform', eps=1e-6,
                 mlp_activation='gelu'):
        super(GPT, self).__init__()
        self.depth = depth
        self.tok_emb = TokenEmbedding(maxlen, vocab_size, 
                        emb_dim, rate=rate, initializer=embedding_initializer)
        self.drop = layers.Dropout(rate)
            
        self.transformer = [TransformerBlock(emb_dim, 
                                heads, mlp_dim, rate=rate,
                                initializer=initializer, eps=eps, 
                                activation=mlp_activation)
                            for _ in range(depth)]

        self.layernorm = layers.LayerNormalization(epsilon=eps)
        self.out = layers.Dense(vocab_size, kernel_initializer=initializer)
        
    def get_padding_mask(self, seq):
        seq = tf.cast(tf.math.equal(seq, 0), tf.float32)
        # add extra dimensions to add the padding
        # to the attention logits.
        return seq[:, tf.newaxis, tf.newaxis, :]  # (batch_size, 1, 1, seq_len)

    def get_attention_mask(self, size):
        mask = 1 - tf.linalg.band_part(tf.ones((size, size)), -1, 0)
        return mask  # (seq_len, seq_len)
    
    def create_mask(self, x):
        attn_mask = self.get_attention_mask(tf.shape(x)[1])
        padding_mask = self.get_padding_mask(x)
        attn_mask = tf.maximum(padding_mask, attn_mask)
        return attn_mask
                       
    def call(self, x):
        mask = self.create_mask(x)
 
        x = self.tok_emb(x)
        x = self.drop(x)

        for i in range(self.depth):
            x = self.transformer[i](x, mask)

        x = self.layernorm(x)
        x = self.out(x)
        return x
       
        
emb_dim = 128
depth = 3
mlp_dim = 256

gpt = GPT(maxlen=maxlen, vocab_size=vocab_size, emb_dim=emb_dim,
            mlp_dim=mlp_dim, depth=depth)
out = gpt(test_batch_x)
out.shape
```




    TensorShape([128, 32, 30000])




```python
gpt.summary()
```

    Model: "gpt"
    _________________________________________________________________
     Layer (type)                Output Shape              Param #   
    =================================================================
     token_embedding (TokenEmbed  multiple                 3844096   
     ding)                                                           
                                                                     
     dropout_4 (Dropout)         multiple                  0         
                                                                     
     transformer_block_1 (Transf  multiple                 132480    
     ormerBlock)                                                     
                                                                     
     transformer_block_2 (Transf  multiple                 132480    
     ormerBlock)                                                     
                                                                     
     transformer_block_3 (Transf  multiple                 132480    
     ormerBlock)                                                     
                                                                     
     layer_normalization_8 (Laye  multiple                 256       
     rNormalization)                                                 
                                                                     
     dense_24 (Dense)            multiple                  3870000   
                                                                     
    =================================================================
    Total params: 8,111,792
    Trainable params: 8,111,792
    Non-trainable params: 0
    _________________________________________________________________


## 4.- Training


```python
from tensorflow.keras.preprocessing.sequence import pad_sequences
```


```python
text_to_ids = tf.keras.layers.StringLookup(
                vocabulary=vectorize_layer.get_vocabulary(),
                mask_token='')
```


```python
ids_to_text = tf.keras.layers.StringLookup(
                vocabulary=vectorize_layer.get_vocabulary(),
                mask_token='',
                invert=True)
```


```python
context = ['spanish sentence = Me gustan los perros rojos. english sentence = ',
           'spanish sentence = Me encanta escribir. english sentence = ',
           'spanish sentence = Los elefantes comen manzanas. english sentence = ',
           'english sentence = I like red dogs. spanish sentence = ',
           'english sentence = I love writing. spanish sentence = ',
           'english sentence = The elephants eat apples. spanish sentence = ']

def sample(model, context, maxlen):  
    words = [context.split()] # add batch dim
    x = tf.cast(text_to_ids(words), tf.int32)
    # Generate new text by sampling from the model
    for i in range(x.shape[1], maxlen):
        # Pad the input sequence to seq_len
        x_pad = tf.keras.preprocessing.sequence.pad_sequences(x, maxlen=maxlen, padding="post")
        # Generate logits from the model
        logits = model(x_pad, training=False)

        pred_index = tf.argmax(logits[:, i-1, :], axis=-1, 
                               output_type=tf.dtypes.int32)
        pred_index = pred_index[tf.newaxis]
        if ids_to_text(pred_index) == '[END]':
            break
        # Concatenate the new token to the sequence
        x = tf.concat([x, pred_index], axis=-1)

    str_list = ids_to_text(x)[0].numpy()
    text = ' '.join([s.decode('utf-8') for s in str_list])
    return text

for c in context:
    trans = sample(gpt, c, maxlen)
    print(f"{trans}")
```

    spanish sentence = Me gustan los perros rojos. english sentence = salimos cáncer. Francamente 3. salimos dieras Francamente salimos salimos Jesús praised pistol. brújula. salimos vieron current can guía. current emocionado current
    spanish sentence = Me encanta escribir. english sentence = 3. fueras weep. cáncer. Francamente 3. salimos dieras interpretar salimos subestimes. Jesús praised cuento brújula. salimos vieron current can guía. current emocionado current
    spanish sentence = Los elefantes comen manzanas. english sentence = fueras weep. cáncer. Francamente 3. salimos dieras interpretar salimos salimos Jesús praised grave. 3. cuento vieron current can guía. current emocionado current
    english sentence = I like red dogs. spanish sentence = fueras weep. cáncer. Francamente 3. salimos dieras Francamente salimos subestimes. Jesús interpretar grave. 3. cuento paint. current can guía. current emocionado current
    english sentence = I love writing. spanish sentence = 3. fueras weep. cáncer. Francamente 3. salimos dieras interpretar weep. salimos Jesús interpretar grave. 3. cuento paint. current can guía. current emocionado current
    english sentence = The elephants eat apples. spanish sentence = fueras weep. cáncer. Francamente 3. salimos dieras Francamente salimos subestimes. Jesús praised grave. 3. cuento paint. current can guía. current emocionado current



```python
optimizer = tf.keras.optimizers.Adam(0.001, beta_1=0.9, beta_2=0.999)
train_loss = tf.keras.metrics.Mean(name='train_loss')
```


```python
def loss_function(label, pred):
    mask = label != 0
    loss_object = tf.keras.losses.SparseCategoricalCrossentropy(
    from_logits=True, reduction='none')
    loss = loss_object(label, pred)

    mask = tf.cast(mask, dtype=loss.dtype)
    loss *= mask

    loss = tf.reduce_sum(loss)/tf.reduce_sum(mask)
    return loss
```


```python
@tf.function
def train_step(inp, tar):
    with tf.GradientTape() as tape:
        pred = gpt(inp, training=True)
        loss = loss_function(tar, pred)
    gradients = tape.gradient(loss, gpt.trainable_variables)
    optimizer.apply_gradients(zip(gradients, gpt.trainable_variables))
    train_loss(loss)
```


```python
epochs = 10

for epoch in range(1, epochs):
    start = time.time()
    train_loss.reset_states()
    for (batch, (inp, tar)) in enumerate(text_ds):
        train_step(inp, tar)
    
    print(f'Time taken for epoch {epoch} is: {time.time() - start:.2f} secs', end=' ')
    print(f'Loss: {train_loss.result():.4f}')
    
    # if epoch % 2 == 0:
    #     print('Output: ')
    #     for c in context:
    #         trans = sample(gpt, c, maxlen)
    #         print(f"{trans}")

    print('Output: ')
    for c in context:
        trans = sample(gpt, c, maxlen)
        print(f"{trans}")            
```

    Time taken for epoch 1 is: 178.38 secs Loss: 3.8739
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like the [UNK]
    spanish sentence = Me encanta escribir. english sentence = I like to go to Boston.
    spanish sentence = Los elefantes comen manzanas. english sentence = The [UNK] are [UNK]
    english sentence = I like red dogs. spanish sentence = Me gusta el [UNK]
    english sentence = I love writing. spanish sentence = Me encanta el libro.
    english sentence = The elephants eat apples. spanish sentence = El hombre se [UNK]
    Time taken for epoch 2 is: 131.19 secs Loss: 2.7865
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like dogs.
    spanish sentence = Me encanta escribir. english sentence = I love you.
    spanish sentence = Los elefantes comen manzanas. english sentence = They eat apples.
    english sentence = I like red dogs. spanish sentence = Me gusta la [UNK]
    english sentence = I love writing. spanish sentence = Me encanta cocinar.
    english sentence = The elephants eat apples. spanish sentence = El avión [UNK]
    Time taken for epoch 3 is: 129.60 secs Loss: 2.4268
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like red dogs teachers.
    spanish sentence = Me encanta escribir. english sentence = I love writing.
    spanish sentence = Los elefantes comen manzanas. english sentence = Those are working here.
    english sentence = I like red dogs. spanish sentence = Me gustan los perros.
    english sentence = I love writing. spanish sentence = Me encantan escribir.
    english sentence = The elephants eat apples. spanish sentence = La guerra duró dos veces.
    Time taken for epoch 4 is: 128.97 secs Loss: 2.2398
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like red cats [UNK]
    spanish sentence = Me encanta escribir. english sentence = I love writing.
    spanish sentence = Los elefantes comen manzanas. english sentence = Those are eating apples.
    english sentence = I like red dogs. spanish sentence = Me gusta los perros.
    english sentence = I love writing. spanish sentence = Me encanta escribir.
    english sentence = The elephants eat apples. spanish sentence = Los científicos comen manzanas.
    Time taken for epoch 5 is: 128.16 secs Loss: 2.1264
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like red dogs red shirts.
    spanish sentence = Me encanta escribir. english sentence = I love writing.
    spanish sentence = Los elefantes comen manzanas. english sentence = Elephants eat apples.
    english sentence = I like red dogs. spanish sentence = Me gusta los perros.
    english sentence = I love writing. spanish sentence = Me encanta escribir.
    english sentence = The elephants eat apples. spanish sentence = Los elefantes comen manzanas.
    Time taken for epoch 6 is: 128.08 secs Loss: 2.0506
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like red dogs juice.
    spanish sentence = Me encanta escribir. english sentence = I love writing.
    spanish sentence = Los elefantes comen manzanas. english sentence = Elephants eat apples.
    english sentence = I like red dogs. spanish sentence = Me gusta el cabello corto.
    english sentence = I love writing. spanish sentence = Me encanta escribir.
    english sentence = The elephants eat apples. spanish sentence = Los elefantes comen manzanas.
    Time taken for epoch 7 is: 127.66 secs Loss: 1.9942
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like red dogs bite.
    spanish sentence = Me encanta escribir. english sentence = I love writing.
    spanish sentence = Los elefantes comen manzanas. english sentence = Elephants eat apples.
    english sentence = I like red dogs. spanish sentence = Me gusta los perros.
    english sentence = I love writing. spanish sentence = Me encanta escribir.
    english sentence = The elephants eat apples. spanish sentence = Los elefantes comen manzanas.
    Time taken for epoch 8 is: 127.68 secs Loss: 1.9514
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like red dogs red tie.
    spanish sentence = Me encanta escribir. english sentence = I love writing.
    spanish sentence = Los elefantes comen manzanas. english sentence = Elephants eat apples.
    english sentence = I like red dogs. spanish sentence = Me gustan los perros roja.
    english sentence = I love writing. spanish sentence = Me encanta escribir.
    english sentence = The elephants eat apples. spanish sentence = Los elefantes comen manzanas.
    Time taken for epoch 9 is: 128.40 secs Loss: 1.9167
    Output: 
    spanish sentence = Me gustan los perros rojos. english sentence = I like red dogs meat.
    spanish sentence = Me encanta escribir. english sentence = I love writing.
    spanish sentence = Los elefantes comen manzanas. english sentence = Elephants eat apples.
    english sentence = I like red dogs. spanish sentence = Me gusta los perros.
    english sentence = I love writing. spanish sentence = Amo escribir.
    english sentence = The elephants eat apples. spanish sentence = Los elefantes comen manzanas.
