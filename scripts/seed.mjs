import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const password = "demo1234";
const users = [
  {
    email: "chacha@demo.com",
    name: "Abril",
    city: "Santa Fe",
    whatsapp: "+54 9 342 555 0101",
    showWhatsapp: true,
  },
  {
    email: "vecino@demo.com",
    name: "Nico",
    city: "Santa Fe",
    whatsapp: null,
    showWhatsapp: false,
  },
  {
    email: "sofia@demo.com",
    name: "Sofía",
    city: "Santa Fe",
    whatsapp: "+54 9 342 555 0202",
    showWhatsapp: true,
  },
];

function isoDaysAgo(days, hours = 0) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function dateDaysAgo(days) {
  return isoDaysAgo(days).slice(0, 10);
}

const posts = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    author: "chacha@demo.com",
    status: "lost",
    species: "cat",
    petName: "Chacha",
    sex: "female",
    age: "adult",
    size: "small",
    description:
      "Gata negra de ojos amarillos, pañuelo rojo. Es muy asustadiza pero no agresiva. Se perdió cerca de la plaza del barrio Sur. Tiene una mancha blanca chiquita en el pecho. La estamos buscando con toda la familia.",
    locationLabel: "Barrio Sur, cerca de la plaza",
    lat: -31.645,
    lng: -60.708,
    radius: 8,
    eventDate: dateDaysAgo(8),
    daysAgo: 7,
    photos: ["gato-2.jpg", "gato-5.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    author: "vecino@demo.com",
    status: "found",
    species: "cat",
    petName: "Michi",
    sex: "unknown",
    age: "young",
    size: "small",
    description:
      "Gatito atigrado que apareció en el patio de casa hace dos días. Está limpio, come bien y usa el arenero. Tiene collar sin chapita. Lo tengo resguardado en Candioti.",
    locationLabel: "Barrio Candioti, zona hospital",
    lat: -31.6155,
    lng: -60.704,
    radius: 5,
    eventDate: dateDaysAgo(2),
    daysAgo: 2,
    photos: ["gato-1.jpg", "gato-3.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    author: "chacha@demo.com",
    status: "lost",
    species: "dog",
    petName: "Luna",
    sex: "female",
    age: "adult",
    size: "medium",
    description:
      "Caniche color damasco, pelo corto, muy mimosa. Se asustó con los cohetes y salió corriendo desde el centro. Llevaba collar rosa con chapita. Responde a su nombre y a la palabra “galletita”.",
    locationLabel: "Centro, peatonal San Martín",
    lat: -31.6333,
    lng: -60.7,
    radius: 10,
    eventDate: dateDaysAgo(3),
    daysAgo: 3,
    photos: ["perro-1.jpg", "perro-2.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    author: "vecino@demo.com",
    status: "found",
    species: "dog",
    petName: "Toto",
    sex: "male",
    age: "adult",
    size: "large",
    description:
      "Perro mestizo grande, color arena, patas blancas. Está en la costanera, asustado y con sed. Le di agua y comida. Parece tener familia: está bien cuidado y es manso.",
    locationLabel: "Costanera, cerca del puente colgante",
    lat: -31.618,
    lng: -60.68,
    radius: 6,
    eventDate: dateDaysAgo(1),
    daysAgo: 1,
    photos: ["perro-3.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    author: "sofia@demo.com",
    status: "found",
    species: "cat",
    petName: "Naranja",
    sex: "male",
    age: "young",
    size: "small",
    description:
      "Gato naranja joven, muy sociable, encontrado en la puerta de casa. Tiene una pata delantera con una manchita blanca. No tiene collar. Busco a su familia o alguien que lo adopte con responsabilidad.",
    locationLabel: "Barrio Norte, calle Uriarte",
    lat: -31.61,
    lng: -60.695,
    radius: 4,
    eventDate: dateDaysAgo(4),
    daysAgo: 4,
    photos: ["gato-4.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000006",
    author: "chacha@demo.com",
    status: "lost",
    species: "cat",
    petName: "Simba",
    sex: "male",
    age: "baby",
    size: "small",
    description:
      "Gatito atigrado de 4 meses, juguetón y curioso. Se escapó por la ventana en Guadalupe. Es chiquito, flaquito y tiene una cola larga con anillos. Por favor no lo persigan, llamenme.",
    locationLabel: "Guadalupe, zona de los monoblocks",
    lat: -31.61,
    lng: -60.72,
    radius: 12,
    eventDate: dateDaysAgo(5),
    daysAgo: 5,
    photos: ["gato-6.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000007",
    author: "vecino@demo.com",
    status: "lost",
    species: "dog",
    petName: "Mora",
    sex: "female",
    age: "senior",
    size: "small",
    description:
      "Perra mestiza chiquita, color negro con canas en el hocico. Es mayor, sorda de un oído y necesita su medicación. Se perdió en Barrio Roma. Es muy tranquila y camina despacio.",
    locationLabel: "Barrio Roma, cerca de la escuela",
    lat: -31.65,
    lng: -60.725,
    radius: 7,
    eventDate: dateDaysAgo(6),
    daysAgo: 6,
    photos: ["perro-4.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000008",
    author: "sofia@demo.com",
    status: "found",
    species: "cat",
    petName: "Negro",
    sex: "male",
    age: "adult",
    size: "medium",
    description:
      "Gato negro entero, sin collar, encontrado en Villa María Selva. Está castrado y es muy cariñoso. Lo tengo en el garage con agua y comida. Si es tuyo, escribime y coordinamos.",
    locationLabel: "Villa María Selva, pasaje interno",
    lat: -31.6,
    lng: -60.71,
    radius: 5,
    eventDate: dateDaysAgo(2),
    daysAgo: 2,
    photos: ["gato-5.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000009",
    author: "chacha@demo.com",
    status: "lost",
    species: "dog",
    petName: "Canela",
    sex: "female",
    age: "young",
    size: "medium",
    description:
      "Perra dorada de año y medio, orejas caídas y cola larga. Se perdió en Candioti mientras paseábamos. Es muy amigable, se acerca si la llamás. Tiene microchip y collar celeste.",
    locationLabel: "Candioti, bulevar Gálvez",
    lat: -31.62,
    lng: -60.7,
    radius: 9,
    eventDate: dateDaysAgo(1),
    daysAgo: 1,
    photos: ["perro-5.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000010",
    author: "vecino@demo.com",
    status: "found",
    species: "dog",
    petName: "Rocky",
    sex: "male",
    age: "adult",
    size: "large",
    description:
      "Perro marrón grande, con collar verde, encontrado en Alto Verde. Está flaco y tiene una pata lastimada. Lo llevamos al veterinario y está estable. Buscamos a su familia.",
    locationLabel: "Alto Verde, bajada de lancha",
    lat: -31.67,
    lng: -60.68,
    radius: 15,
    eventDate: dateDaysAgo(3),
    daysAgo: 3,
    photos: ["perro-6.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000011",
    author: "sofia@demo.com",
    status: "lost",
    species: "cat",
    petName: "Pantera",
    sex: "female",
    age: "young",
    size: "small",
    description:
      "Gata negra joven, chiquita, con un pequeño lunar blanco en la panza. Se perdió en Barrio Sur. Es tímida, no se deja agarrar fácil. Si la ves, no la corras y escribime.",
    locationLabel: "Barrio Sur, calle San Jerónimo",
    lat: -31.648,
    lng: -60.712,
    radius: 6,
    eventDate: dateDaysAgo(9),
    daysAgo: 8,
    photos: ["gato-3.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000012",
    author: "chacha@demo.com",
    status: "found",
    species: "dog",
    petName: "Toby",
    sex: "male",
    age: "baby",
    size: "small",
    description:
      "Cachorro blanco con manchas marrones, encontrado en el centro. Tiene aproximadamente 3 meses. Está desparasitado y come alimento balanceado. Busco a su dueño o tránsito responsable.",
    locationLabel: "Centro, plaza 25 de Mayo",
    lat: -31.638,
    lng: -60.695,
    radius: 5,
    eventDate: dateDaysAgo(1),
    daysAgo: 1,
    photos: ["perro-2.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000013",
    author: "vecino@demo.com",
    status: "lost",
    species: "cat",
    petName: "Misha",
    sex: "female",
    age: "adult",
    size: "medium",
    description:
      "Gata gris atigrada, ojos verdes, muy casera. Se perdió en Candioti. No tiene collar porque se lo saca. Es asustadiza con extraños pero mansa. Recompensa a quien la vea.",
    locationLabel: "Candioti, zona de bares",
    lat: -31.625,
    lng: -60.69,
    radius: 8,
    eventDate: dateDaysAgo(4),
    daysAgo: 4,
    photos: ["gato-1.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000014",
    author: "sofia@demo.com",
    status: "found",
    species: "cat",
    petName: "Frida",
    sex: "female",
    age: "adult",
    size: "small",
    description:
      "Gata blanca con manchas negras, encontrada en Barrio Norte. Está castrada, limpia y acostumbrada a personas. Parece una mascota perdida. La tengo en casa con comida y agua.",
    locationLabel: "Barrio Norte, calle Castelli",
    lat: -31.605,
    lng: -60.705,
    radius: 10,
    eventDate: dateDaysAgo(2),
    daysAgo: 2,
    photos: ["gato-4.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000015",
    author: "chacha@demo.com",
    status: "lost",
    species: "dog",
    petName: "Choco",
    sex: "male",
    age: "adult",
    size: "medium",
    description:
      "Perro chocolate con pecho blanco, muy compañero. Se perdió en Barrio Roma. Llevaba collar rojo y chapita con mi teléfono. Es tranquilo y responde al nombre. Lo extrañamos mucho.",
    locationLabel: "Barrio Roma, cerca del club",
    lat: -31.66,
    lng: -60.72,
    radius: 10,
    eventDate: dateDaysAgo(7),
    daysAgo: 7,
    photos: ["perro-1.jpg"],
  },
  {
    id: "a1000000-0000-4000-8000-000000000016",
    author: "vecino@demo.com",
    status: "found",
    species: "dog",
    petName: "Kira",
    sex: "female",
    age: "young",
    size: "medium",
    description:
      "Perra negra joven, encontrada en la costanera. Tiene collar naranja sin datos. Es juguetona y camina bien con correa. La tengo resguardada y busco a su familia.",
    locationLabel: "Costanera, zona de bicisendas",
    lat: -31.625,
    lng: -60.675,
    radius: 7,
    eventDate: dateDaysAgo(1),
    daysAgo: 1,
    photos: ["perro-5.jpg"],
  },
];

async function ensureUsers() {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const existing = data.users;

  const ids = new Map();

  for (const user of users) {
    const found = existing.find((item) => item.email === user.email);
    if (found) {
      ids.set(user.email, found.id);
      const { error: updateError } = await admin.auth.admin.updateUserById(found.id, {
        password,
        email_confirm: true,
        user_metadata: { name: user.name },
      });
      if (updateError) throw updateError;
      continue;
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: user.email,
      password,
      email_confirm: true,
      user_metadata: { name: user.name },
    });
    if (createError) throw createError;
    ids.set(user.email, created.user.id);
  }

  for (const user of users) {
    const id = ids.get(user.email);
    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id,
        name: user.name,
        city: user.city,
        whatsapp: user.whatsapp,
        show_whatsapp: user.showWhatsapp,
      },
      { onConflict: "id" },
    );
    if (profileError) throw profileError;
  }

  return ids;
}

async function seedPosts(ids) {
  const rows = posts.map((post) => ({
    id: post.id,
    author_id: ids.get(post.author),
    status: post.status,
    species: post.species,
    pet_name: post.petName,
    sex: post.sex,
    age: post.age,
    size: post.size,
    description: post.description,
    location_label: post.locationLabel,
    location: `SRID=4326;POINT(${post.lng} ${post.lat})`,
    search_radius_km: post.radius,
    event_date: post.eventDate,
    resolved_at: null,
    created_at: isoDaysAgo(post.daysAgo, 2),
    updated_at: isoDaysAgo(post.daysAgo, 2),
  }));

  const { error } = await admin.from("posts").upsert(rows, { onConflict: "id" });
  if (error) throw error;

  const photoRows = posts.flatMap((post, postIndex) =>
    post.photos.map((photo, photoIndex) => ({
      id: `b1000000-0000-4000-8000-${String(postIndex + 1).padStart(6, "0")}${String(
        photoIndex + 1,
      ).padStart(6, "0")}`,
      post_id: post.id,
      url: `/seed/${photo}`,
      position: photoIndex,
    })),
  );

  const { error: photoError } = await admin
    .from("post_photos")
    .upsert(photoRows, { onConflict: "id" });
  if (photoError) throw photoError;
}

async function seedConversations(ids) {
  const conversations = [
    {
      id: "c1000000-0000-4000-8000-000000000001",
      postId: posts[0].id,
      owner: ids.get("chacha@demo.com"),
      interested: ids.get("vecino@demo.com"),
      messages: [
        {
          id: "d1000000-0000-4000-8000-000000000001",
          sender: ids.get("vecino@demo.com"),
          body: "Hola, creo que vi a Chacha anoche cerca de la plaza. Era negra y tenía algo rojo en el cuello.",
          minutesAgo: 95,
        },
        {
          id: "d1000000-0000-4000-8000-000000000002",
          sender: ids.get("chacha@demo.com"),
          body: "¡Gracias! ¿La viste cerca de qué calle? Estamos saliendo a buscarla.",
          minutesAgo: 90,
        },
        {
          id: "d1000000-0000-4000-8000-000000000003",
          sender: ids.get("vecino@demo.com"),
          body: "Sobre San Jerónimo, entre 3 de Febrero y Uruguay. Se metió debajo de un auto.",
          minutesAgo: 84,
        },
      ],
    },
    {
      id: "c1000000-0000-4000-8000-000000000002",
      postId: posts[2].id,
      owner: ids.get("chacha@demo.com"),
      interested: ids.get("sofia@demo.com"),
      messages: [
        {
          id: "d1000000-0000-4000-8000-000000000004",
          sender: ids.get("sofia@demo.com"),
          body: "Hola, vi el aviso de Luna. ¿Ya la encontraron?",
          minutesAgo: 40,
        },
      ],
    },
  ];

  for (const conversation of conversations) {
    const last = conversation.messages.at(-1);
    const lastAt = new Date(Date.now() - last.minutesAgo * 60_000).toISOString();
    const { error } = await admin.from("conversations").upsert(
      {
        id: conversation.id,
        post_id: conversation.postId,
        owner_id: conversation.owner,
        interested_id: conversation.interested,
        created_at: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
        last_message_at: lastAt,
      },
      { onConflict: "id" },
    );
    if (error) throw error;

    const { error: messageError } = await admin.from("messages").upsert(
      conversation.messages.map((message) => ({
        id: message.id,
        conversation_id: conversation.id,
        sender_id: message.sender,
        body: message.body,
        created_at: new Date(Date.now() - message.minutesAgo * 60_000).toISOString(),
      })),
      { onConflict: "id" },
    );
    if (messageError) throw messageError;
  }
}

async function main() {
  console.log("Creando usuarios demo...");
  const ids = await ensureUsers();
  console.log("Cargando publicaciones...");
  await seedPosts(ids);
  console.log("Cargando chats...");
  await seedConversations(ids);

  console.log("\nListo. Datos demo de Santa Fe cargados.");
  console.log("  chacha@demo.com / demo1234");
  console.log("  vecino@demo.com / demo1234");
  console.log("  sofia@demo.com / demo1234");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
