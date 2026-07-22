import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1 gap-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Diário de bordo do TechMart API</h1>
      <p className="text-fd-muted-foreground">
        Aqui a gente conta, passo a passo e sem juridiquês, como o backend da
        TechMart foi construído: por que cada decisão foi tomada, o que veio
        antes do quê, e o porquê por trás de cada escolha técnica.
      </p>
      <p>
        <Link href="/docs" className="font-medium underline">
          Começar a leitura →
        </Link>
      </p>
    </div>
  );
}
