interface HeadingProps {
    titulo: string;
    descricao: string;
};

export const Heading: React.FC<HeadingProps> = ({
    titulo,
    descricao,
}) => {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{titulo}</h2>
                <p className="text-sm text-muted-foreground">
                    {descricao}
                </p>
        </div>
    )
}