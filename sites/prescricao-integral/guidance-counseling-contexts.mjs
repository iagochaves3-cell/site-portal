import { COUNSELING_SOURCES } from "./caregiver-counseling.mjs";

export const counselingGuidanceRecords = [{
  name: "Cólica do lactente",
  aliases: ["Cólicas do lactente", "Cólica do Lactente Aguda", "Cólicas do Lactente Agudas"],
  status: "source-reviewed",
  setting: "home",
  revisedAt: "2026-10-04",
  general: "Nem todo choro é cólica. O pediatra deve avaliar o bebê e excluir fome, frio, calor, fralda suja e causas de doença. Mantenha o aleitamento e peça apoio para dividir os cuidados; nunca sacuda o bebê.",
  diagnosis: "As técnicas de conforto se aplicam à cólica do lactente após avaliação pediátrica. Os cuidados de segurança com sono, manta e temperatura devem acompanhar essas orientações.",
  expected: "A cólica costuma começar nas primeiras semanas, atingir o pico por volta de 6–8 semanas e melhorar até os 3–4 meses, desaparecendo antes dos 5 meses. O bebê deve continuar mamando e ganhando peso.",
  alarm: "Febre, recusa para mamar, perda de peso, sonolência fora do habitual, redução da urina, vômitos repetidos ou sangue nas fezes não devem ser atribuídos automaticamente à cólica.",
  immediate: "Procure atendimento imediatamente se houver febre em bebê pequeno, vômito verde ou com sangue, barriga muito distendida, sangue nas fezes, dificuldade para respirar ou para acordar, ou incapacidade de mamar.",
  return: "Siga o acompanhamento definido pelo pediatra. Antecipe a reavaliação se o choro mudar de padrão, persistir, dificultar as mamadas ou sobrecarregar a família; após os 5 meses, reavalie o diagnóstico.",
  sources: [...COUNSELING_SOURCES.colic],
  reviewNotes: "Orientações solicitadas em 04/10/2026, conciliadas com SBP e sono seguro da AAP. Não incluem medicação ou dose nem autorizam alta sem avaliação do bebê.",
}];
