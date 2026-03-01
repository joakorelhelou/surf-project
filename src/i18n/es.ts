export const es = {
  brand: '🏄 Pronóstico de Surf',
  locale: 'es-ES' as const,
  search: {
    placeholder: 'Buscar spots de surf…',
  },
  conditions: {
    title: 'Condiciones (7 días)',
    bestWindows: 'Mejores momentos',
    today: 'Hoy',
    tomorrow: 'Mañana',
    excellent: 'Excelente',
    good: 'Buena',
    fair: 'Regular',
    poor: 'Mala',
  },
  waves: {
    title: 'Olas (7 días)',
    colTime: 'Hora',
    colHeight: 'Altura',
    colPeriod: 'Período',
    colDirection: 'Dirección',
    colPower: 'Potencia (kW/m)',
  },
  wind: {
    title: 'Viento (7 días)',
    colTime: 'Hora',
    colSpeed: 'Velocidad (km/h)',
    colGust: 'Ráfaga',
    colDir: 'Dir',
  },
  tides: {
    title: 'Mareas (48h)',
    high: 'Marea Alta',
    low: 'Marea Baja',
    unavailable: 'Datos de marea no disponibles para esta ubicación (sin estación NOAA).',
  },
  forecast: {
    closeLabel: 'Cerrar pronóstico',
  },
  howItWorks: {
    triggerLabel: 'Cómo funciona la puntuación',
    title: 'Cómo Funciona la Puntuación',
    subtitle: 'Entiende las condiciones de surf de un vistazo',
    intro1: 'Cada hora combinamos cinco señales oceánicas y meteorológicas en un único número de',
    introBold1: '0 a 100%',
    intro2: '. Un mayor porcentaje indica mejores condiciones de surf. El banner de',
    introBold2: 'Mejores Momentos',
    intro3: 'en la parte superior del pronóstico te muestra los mejores momentos para entrar al agua.',
    scoreLegend: 'Leyenda de puntuación',
    footer:
      'Los datos provienen de las APIs Marine y Weather de Open-Meteo. Los pronósticos se actualizan cada pocas horas. La puntuación es una guía — el conocimiento local, las mareas y la afluencia de gente siempre importan.',
    labels: [
      { label: 'Excelente', desc: 'Sal a surfear — las condiciones están perfectas.' },
      { label: 'Buena',     desc: 'Buena sesión, con algún pequeño compromiso.' },
      { label: 'Regular',   desc: 'Se puede surfear, pero no es lo ideal.' },
      { label: 'Mala',      desc: 'Flat, destrozado por el viento o demasiado grande.' },
    ],
    factors: [
      {
        title: 'Potencia del Oleaje',
        description: 'Energía del swell — altura² × período',
        detail:
          'Es el factor más importante. Combina la altura y el período del swell en un único número de energía: H² × T (proporcional a la potencia real de las olas en kW/m). Una ola de 1,8 m con 14 s de período tiene unas 45 unidades de potencia — excelente para surfear. Una de 0,5 m con 8 s solo tiene 2 unidades — apenas surfeable. La puntuación alcanza su máximo en el "punto ideal" de groundswell organizado (aprox. 1,5–3 m a 12–18 s) y cae para olas peligrosamente grandes.',
      },
      {
        title: 'Dirección del Swell',
        description: 'Con qué ángulo llega el swell al spot',
        detail:
          'Incluso un swell potente es inútil si llega desde la dirección equivocada. Cada spot tiene una orientación conocida — la dirección en la que la rompiente mira al océano. La puntuación es máxima cuando el swell viaja directamente hacia esa orientación (de frente = 100%) y cae suavemente al aumentar el ángulo. Un swell paralelo a la costa puntúa alrededor del 50%; uno en dirección contraria puntúa cerca del 0%.',
      },
      {
        title: 'Calidad del Swell',
        description: 'Qué tan organizada está la energía oceánica',
        detail:
          'No toda la altura de ola es útil. Este factor mide cuánta parte de la altura total proviene del swell organizado frente al oleaje local de viento (chop). Una ratio alta significa que la superficie está limpia y las olas son predecibles. Cuando el océano está dominado por chop desorganizado (vientos locales fuertes), esta puntuación cae aunque las olas parezcan grandes.',
      },
      {
        title: 'Velocidad del Viento',
        description: 'Fuerza del viento',
        detail:
          'Los vientos ligeros (menos de 8 km/h) dejan la superficie vidriosa y puntúan 100. A medida que el viento aumenta, agita el agua y levanta espuma de las caras de las olas. Por encima de 40 km/h la superficie se vuelve desordenada y la puntuación cae a cero.',
      },
      {
        title: 'Dirección del Viento',
        description: 'Si el viento perfila o arruina las olas',
        detail:
          'El viento offshore sopla desde la tierra hacia el mar — perfila las caras de las olas y las mantiene erguidas, creando tubos limpios. El viento onshore sopla al revés, derrumbando las olas antes de que rompan correctamente. Este factor tiene un peso del 20% porque la dirección es tan importante como la velocidad — un fuerte offshore suele ser mejor que un suave onshore. Cada spot tiene una orientación conocida para que la app pueda distinguirlos.',
      },
    ],
  },
};
